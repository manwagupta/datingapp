using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            Context = context;
        }

        public DataContext Context { get; }

        public async Task<MemberDTO> GetMemberAsync(string username)
        {
            return await Context.Users
            .Where(x => x.UserName == username).ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDTO>> GetMembersAsync(UserParams userParams) 
        {
            var query = Context.Users.AsQueryable();

            query = query.Where(u => u.UserName != userParams.currentUserName);
            query = query.Where(u => u.Gender == userParams.Gender);

            var minDOB = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDOB = DateTime.Today.AddYears(-userParams.MinAge);

            query = query.Where(u => u.DateOfBirth >= minDOB && u.DateOfBirth <= maxDOB);

            query = userParams.OrderBy switch 
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)       
            };
                
            
            return await PagedList<MemberDTO>.CreateAsync(query.ProjectTo<MemberDTO>(_mapper
            .ConfigurationProvider).AsNoTracking(),
            userParams.PageNumber,userParams.PageSize);
        }   

        public async Task<AppUsers> GetUserByIdAsync(int Id)
        {
            return await Context.Users.FindAsync(Id);
        }

        public async Task<AppUsers> GetUserByUsernameAsync(string Username)
        {
            return await Context.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(x => x.UserName == Username);
        }

        public async Task<IEnumerable<AppUsers>> GetUsersAsync()
        {
            return await Context.Users
            .Include(p => p.Photos)
            .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await Context.SaveChangesAsync() > 0;
        }

        public void Update(AppUsers user)
        {
            Context.Entry(user).State = EntityState.Modified;
        }
    }
}