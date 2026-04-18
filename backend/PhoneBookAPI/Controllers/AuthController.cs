using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PhoneBookAPI.DTOs;
using PhoneBookAPI.Entities;
using PhoneBookAPI.Interfaces;

namespace PhoneBookAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;
        private readonly IPasswordHasher<User> _hasher;

        public AuthController(
            IUserRepository userRepository,
            IJwtService jwtService,
            IPasswordHasher<User> hasher)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _hasher = hasher;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userRepository.GetByUsername(dto.Username);

            if (user == null)
                return Unauthorized(new { message = "Invalid username or password" });

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Invalid username or password" });

            var accessToken = _jwtService.GenerateToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userRepository.Update(user);

            return Ok(new
            {
                accessToken,
                refreshToken,
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    role = user.Role
                }
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] TokenDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto?.RefreshToken))
                return Unauthorized(new { message = "Missing refresh token" });

            var user = await _userRepository.GetByRefreshToken(dto.RefreshToken);

            if (user == null)
                return Unauthorized(new { message = "Invalid refresh token" });

            if (user.RefreshTokenExpiryTime < DateTime.UtcNow)
                return Unauthorized(new { message = "Refresh token expired" });

            var newAccessToken = _jwtService.GenerateToken(user);
            var newRefreshToken = _jwtService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userRepository.Update(user);

            return Ok(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken
            });
        }
    }
}