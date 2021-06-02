using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interface;
using API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;
        public LikesRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, likedUserId);
        }

        public async Task<PagedList<LikeDTO>> GetUserLikes(LikesParams likesparams)
        {
            var users = _context.Users.OrderBy(o => o.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            if (likesparams.Predicate == "liked") //Currently logged in users has liked the users.
            {
                likes = likes.Where(like => like.SourceUserId == likesparams.UserId);
                users = likes.Select(like => like.LikedUser);
            }

            if (likesparams.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == likesparams.UserId);
                users = likes.Select(like => like.SourceUser);
            }

            var likedUsers = users.Select(user => new LikeDTO
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                Id = user.Id
            });
            return await PagedList<LikeDTO>.CreateAsync(likedUsers, likesparams.PageNumber, 
            likesparams.PageSize);
        }

        public async Task<AppUsers> GetUsersWithLikes(int userId)
        {
            return await _context.Users
            .Include(x => x.LikedUsers).FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}