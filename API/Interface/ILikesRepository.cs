using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interface
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int likedUserId);
        Task<AppUsers> GetUsersWithLikes(int userId);
        Task<PagedList<LikeDTO>> GetUserLikes(LikesParams likesparams);
    }
}