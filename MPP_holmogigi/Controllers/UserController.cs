using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NuGet.Common;
using MPP.DTOs;
using MPP.Models;
using MPP.Database;
using System.Data.SqlClient;

namespace MPP.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BodyBuildersDatabasesContext _dbContext;
        private readonly JwtSetter _jwtSetter;

        public UsersController(BodyBuildersDatabasesContext dbContext, IOptions<JwtSetter> JwtSetter)
        {
            _dbContext = dbContext;
            _jwtSetter = JwtSetter.Value;
        }

        public static string HashPassword(string password)
        {
            byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSetter.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.AccessLevel.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private static string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private async Task<ConfirmationCode> GenerateConfirmationCode(User user)
        {
            string code = string.Empty;
            bool exists = true;

            while (exists)
            {
                code = GenerateRandomString(8);
                exists = await _dbContext.ConfirmationCodes.AnyAsync(cc => cc.Code == code);
            }

            var confirmationCode = new ConfirmationCode
            {
                UserId = user.Id,
                Code = code,
                Expiration = DateTime.UtcNow.AddMinutes(10),
                Used = false
            };

            _dbContext.ConfirmationCodes.Add(confirmationCode);
            await _dbContext.SaveChangesAsync();

            return confirmationCode;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<dynamic>> Register(UserRegisterDTO userRegisterDTO)
        {
            // VALIDATION
            if (userRegisterDTO == null)
                return BadRequest("!ERROR! User not allowed null!");
            if (userRegisterDTO.Password == null || userRegisterDTO.Password.Length < 8)
                return BadRequest("!ERROR! Password is too short (pass.length() > 8)!");
            if (userRegisterDTO.Password == null || !userRegisterDTO.Password.Any(char.IsLetter) || !userRegisterDTO.Password.Any(char.IsDigit))
                return BadRequest("!ERROR! Password must contain at least one latter and one number!");
            if (userRegisterDTO.Name == null || userRegisterDTO.Name.Length < 3)
                return BadRequest("!ERROR! Name is too short (name.length() > 3)!");
            if (userRegisterDTO.Bio == null || userRegisterDTO.Bio.Length < 3)
                return BadRequest("!ERROR! Bio is too short (bio.length() > 3)!");
            if (userRegisterDTO.Location == null || userRegisterDTO.Location.Length < 3)
                return BadRequest("!ERROR! Location is too short (location.length() > 3)!");

            if (await _dbContext.Users.AnyAsync(u => u.Name == userRegisterDTO.Name))
                return BadRequest("!ERROR! Username already exists!");
            // GOOD 

            var user = new User
            {
                Name = userRegisterDTO.Name,
                Password = HashPassword(userRegisterDTO.Password!),

                UserProfile = new UserProfile
                {
                    Bio = userRegisterDTO.Bio,
                    Location = userRegisterDTO.Location,
                    Birthday = userRegisterDTO.Birthday,
                    Gender = userRegisterDTO.Gender,
                    MaritalStatus = userRegisterDTO.MaritalStatus,
                    PagePreference = 5
                }
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            var userDTO = UserToDTO(user);
            userDTO.Password = null;

            var confirmationCode = await GenerateConfirmationCode(user);

            return new
            {
                user = userDTO,
                token = confirmationCode.Code,
                expiration = confirmationCode.Expiration
            };
        }

        [HttpPost("register/confirm/{code}")]
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmAccount(string code)
        {
            var confirmationCode = await _dbContext.ConfirmationCodes
                .SingleOrDefaultAsync(cc => cc.Code == code);
            if (confirmationCode == null)
                return BadRequest("Invalid confirmation code.");

            if (confirmationCode.Used)
                return BadRequest("Confirmation code has already been used.");
            if (confirmationCode.Expiration < DateTime.UtcNow)
                return BadRequest("Confirmation code has expired.");

            var user = await _dbContext.Users.FindAsync(confirmationCode.UserId);
            if (user == null)
                return BadRequest("Invalid confirmation code.");

            if (user.AccessLevel > 0)
                return BadRequest("Account has already been confirmed.");

            user.AccessLevel = AccessLevel.Regular; 
            confirmationCode.Used = true;
            await _dbContext.SaveChangesAsync();

            return Ok("Account successfully confirmed.");
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<dynamic>> Login(UserDTO userDTO)
        {
            if (userDTO.Name == null || userDTO.Password == null)
                return BadRequest();

            var hashedPassword = HashPassword(userDTO.Password);
            var user = await _dbContext.Users
                .Include(u => u.UserProfile)
                .SingleOrDefaultAsync(u => u.Name == userDTO.Name && u.Password != null && u.Password == hashedPassword);
            if (user == null)
                return Unauthorized("Invalid username or password");

            // Check if user is confirmed
            if (user.AccessLevel == 0)
                return Unauthorized("User is not confirmed");

            var token = GenerateJwtToken(user);
            user.Password = null;

            return new
            {
                user,
                token
            };
        }

        [HttpGet("count/{pageSize}")]
        [Role(AccessLevel.Admin)]
        public async Task<int> GetTotalNumberOfPages(int pageSize = 10)
        {
            int total = await _dbContext.Users.CountAsync();
            int totalPages = total / pageSize;
            if (total % pageSize > 0)
                totalPages++;

            return totalPages;
        }

        [HttpGet("{page}/{pageSize}")]
        [Role(AccessLevel.Admin)]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers(int page = 0, int pageSize = 10)
        {
            if (_dbContext.Users == null)
                return NotFound();

            return await _dbContext.Users
                .Include(x => x.UserProfile)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        [HttpPatch("{id}/PagePreference/{pref}")]
        public async Task<ActionResult<UserDTO>> PatchPreference(int id, int pref)
        {
            if (_dbContext.Users == null)
                return NotFound();

            if (pref < 0 || pref > 100)
                return BadRequest("Preference must be between 0 and 100.");

            var user = await _dbContext.Users
                .Include(x => x.UserProfile)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
                return NotFound();

            var extracted = ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 < AccessLevel.Admin && user.Id != extracted.Item1)
                return Unauthorized("You can only update your own preferences.");

            user.UserProfile.PagePreference = pref;
            await _dbContext.SaveChangesAsync();

            var userDTO = UserToDTO(user);
            userDTO.Password = null;

            return userDTO;
        }

        [HttpPatch("PagePreferences/{pref}")]
        [Role(AccessLevel.Admin)]
        public async Task<ActionResult<UserDTO>> PatchPreferences(int pref)
        {
            if (_dbContext.UserProfiles == null)
                return NotFound();

            if (pref < 0 || pref > 100)
                return BadRequest("Preference must be between 0 and 100.");

            long count = await _dbContext.UserProfiles
                .CountAsync();

            var parameter = new SqlParameter("@PagePreference", pref);
            await _dbContext.Database.ExecuteSqlRawAsync("UPDATE [UserProfiles] SET [PagePreference] = @PagePreference", parameter);

            return Ok($"Updated {count} users with the new preference.");
        }

        [HttpPatch("{id}/AccessLevel/{accessLevel}")]
        [Role(AccessLevel.Admin)]
        public async Task<ActionResult<UserDTO>> PatchAccessLevel(long id, AccessLevel accessLevel)
        {
            if (_dbContext.Users == null)
                return NotFound();

            var user = await _dbContext.Users
                .FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
                return NotFound();

            user.AccessLevel = accessLevel;
            await _dbContext.SaveChangesAsync();

            var userDTO = UserToDTO(user);
            userDTO.Password = null;

            return userDTO;
        }

        [HttpGet]
        [Role(AccessLevel.Admin)]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            if (_dbContext.Users == null)
                return NotFound();

            return await _dbContext.Users
                .Select(x => UserToDTO(x))
                .ToListAsync();
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<UserProfileDTO>> GetUser(long id)
        {
            if (_dbContext.Users == null)
                return NotFound();

            var user = await _dbContext.Users
                .Include(x => x.UserProfile)
                .FirstOrDefaultAsync(x => x.Id == id);
            //.FindAsync(id);
            if (user == null)
                return NotFound();

            int bdcount = await _dbContext.Bodybuilders
                .Where(x => x.UserId == id)
            .CountAsync();

            int coacount = await _dbContext.Coaches
                .Where(x => x.UserId == id)
            .CountAsync();

            int gymcount = await _dbContext.Gyms
                .Where(x => x.UserId == id)
            .CountAsync();

            int contestcount = await _dbContext.Contests
                .Where(x => x.UserId == id)
                .CountAsync();

            var userProfileDTO = new UserProfileDTO
            {
                Id = user.Id,
                Name = user.Name,
                Password = null,

                AccessLevel = user.AccessLevel,
                UserProfile = user.UserProfile,

                BodybuildersCount = bdcount,
                CoachesCount = coacount,
                GymsCount = gymcount,
                ContestsCount = contestcount
            };

            return userProfileDTO;
        }

        [HttpGet("search")]
        [Role(AccessLevel.Admin)]
        public async Task<ActionResult<IEnumerable<UserDTO>>> SearchUsers(string query)
        {
            if (_dbContext.Users == null)
                return NotFound();

            if (query.Length < 3)
                return NotFound();

            return await _dbContext.Users
                .Where(x => x.Name != null && x.Name.ToLower().Contains(query.ToLower()))
                .Select(x => UserToDTO(x))
                .Take(100)
                .ToListAsync();
        }

        [HttpPut("{id}")]
        [Role(AccessLevel.Admin)]
        public async Task<IActionResult> PutUser(long id, UserDTO userDTO)
        {
            if (id != userDTO.Id)
                return BadRequest();

            var user = await _dbContext.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            user.Name = userDTO.Name;
            user.Password = userDTO.Password;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!UserExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPost]
        [Role(AccessLevel.Admin)]
        public async Task<ActionResult<UserDTO>> PostUser(UserDTO userDTO)
        {
            if (_dbContext.Users == null)
                return Problem("Entity set 'StoreContext.Users' is null.");

            var user = new User
            {
                Name = userDTO.Name,
                Password = userDTO.Password,
                AccessLevel = AccessLevel.Unconfirmed,

                UserProfile = new UserProfile
                {
                },
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetUser),
                new { id = user.Id },
                UserToDTO(user));
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        [Role(AccessLevel.Admin)]
        public async Task<IActionResult> DeleteUser(long id)
        {
            if (_dbContext.Users == null)
                return NotFound();

            var user = await _dbContext.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(long id)
        {
            return _dbContext.Users.Any(e => e.Id == id);
        }

        private static UserDTO UserToDTO(User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Password = user.Password,
            };
        }

        public static Tuple<long, AccessLevel>? ExtractJWTToken(ClaimsPrincipal claimsPrincipal)
        {
            var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long userId))
                return null;

            var accessLevelClaim = claimsPrincipal.FindFirst(ClaimTypes.Role);
            if (accessLevelClaim == null || !Enum.TryParse<AccessLevel>(accessLevelClaim.Value, out var userAccessLevel))
                return null;

            return new Tuple<long, AccessLevel>(userId, userAccessLevel);
        }


    }
}
