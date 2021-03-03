using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interface
{
    public interface IUserRepository
    {
        void Update(AppUsers appUsers);
        Task<bool> SaveAllAsync();

        Task<IEnumerable<AppUsers>> GetUsersAsync();

        Task<AppUsers> GetUserByIdAsync(int Id);
        
        Task<AppUsers> GetUserByUsernameAsync(string Username);

        Task<PagedList<MemberDTO>> GetMembersAsync(UserParams userParams);

        Task<MemberDTO> GetMemberAsync(string username);
    }
}