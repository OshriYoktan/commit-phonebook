using PhoneBookAPI.Entities;

namespace PhoneBookAPI.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
        string GenerateRefreshToken();
    }
}
