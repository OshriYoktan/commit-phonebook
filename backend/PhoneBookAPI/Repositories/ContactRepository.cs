using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using PhoneBookAPI.Data;
using PhoneBookAPI.DTOs;
using PhoneBookAPI.Interfaces;

namespace PhoneBookAPI.Repositories
{
    public class ContactRepository : IContactRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ContactRepository(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<ContactDTO>> GetAllContacts()
        {
            return await _context.Contacts
                .AsNoTracking()
                .ProjectTo<ContactDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}