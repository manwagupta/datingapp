using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutomapperProfiles : Profile
    {
        public AutomapperProfiles()
        {
            CreateMap<AppUsers,MemberDTO>().ForMember(dest => dest.PhotoUrl,opt => opt.MapFrom(src => 
            src.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(dest => dest.Age,opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo,PhotoDto>();
            CreateMap<MemberUpdateDTO,AppUsers>();
            CreateMap<RegisterUser,AppUsers>();
            CreateMap<Message,MessageDTO>()
            .ForMember(dest => dest.SenderPhotoUrl, 
            opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(dest => dest.RecipientPhotoUrl, 
            opt => opt.MapFrom(src => src.Recipient.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}