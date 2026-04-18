using AutoMapper;
using PhoneBookAPI.DTOs;
using PhoneBookAPI.Entities;

namespace PhoneBookAPI.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Contact, ContactDTO>();
        }
    }
}
