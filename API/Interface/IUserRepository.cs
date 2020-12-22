using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interface
{
    public interface IUserRepository
    {
        void Update(AppUsers appUsers);
        Task<bool> SallAllAsync();

        Task<IEnumerable<AppUsers>> GetUsersAsync();

        Task<AppUsers> GetUserByIdAsync(int Id);
        
        Task<AppUsers> GetUserByUsernameAsync(string Username);

        Task<IEnumerable<MemberDTO>> GetMembersAsync();

        Task<MemberDTO> GetMemberAsync(string username);
    }
}