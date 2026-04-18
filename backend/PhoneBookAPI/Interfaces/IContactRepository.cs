using PhoneBookAPI.DTOs;

namespace PhoneBookAPI.Interfaces
{
    public interface IContactRepository
    {
        Task<List<ContactDTO>> GetAllContacts();
    }
}
