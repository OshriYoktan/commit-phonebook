using PhoneBookAPI.Entities;

namespace PhoneBookAPI.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByUsername(string username);
        Task<User?> GetByRefreshToken(string refreshToken);
        Task Update(User user);
    }
}