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
                Password = userRegisterDTO.Password,
                UserProfile = new UserProfile
                {
                    Bio = userRegisterDTO.Bio,
                    Location = userRegisterDTO.Location,
                    Birthday = userRegisterDTO.Birthday,
                    Gender = userRegisterDTO.Gender,
                    MaritalStatus = userRegisterDTO.MaritalStatus
                }
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            var userDTO = UserToDTO(user);
            userDTO.Password = null;

            var token = GenerateConfirmationToken(user);

            return new
            {
                user = userDTO,
                token
            };
        }

        [HttpPost("register/confirm/{code}")]
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmAccount(string code)
        {
            var confirmationCode = await _dbContext.ConfirmationCodes
                .SingleOrDefaultAsync(cc => cc.Code == code);
            if (confirmationCode == null)
                return BadRequest("!ERROR! Invalid confirmation code!");

            if (confirmationCode.Used)
                return BadRequest("!ERROR! Confirmation code already been used!");
            if (confirmationCode.Expiration < DateTime.UtcNow)
                return BadRequest("!ERROR! Confirmation code expired!");

            var user = await _dbContext.Users.FindAsync(confirmationCode.UserId);
            if (user == null)
                return BadRequest("!ERROR! Invalid confirmation code!");

            if (user.AccessLevel > 0)
                return BadRequest("!ERROR! Account already confirmed!");

            user.AccessLevel = 1;
            confirmationCode.Used = true;
            await _dbContext.SaveChangesAsync();

            return Ok("!Account successfully confirmed!");
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<dynamic>> Login(UserDTO userDTO)
        {
            if (userDTO.Name == null || userDTO.Password == null)
                return BadRequest();

            var user = await _dbContext.Users
                .Include(u=> u.UserProfile)
                .SingleOrDefaultAsync(u => u.Name == userDTO.Name && u.Password != null && u.Password == userDTO.Password);

            if (user == null)
                return Unauthorized("!ERROR! Invalid username or password!");

            user.AccessLevel = 1;

            if (user.AccessLevel == 0)
                return Unauthorized("!ERROR! User is not confirmed!");
            

            var token = GenerateJwtToken(user);
            user.Password = null;

            return new
            {
                user,
                token
            };
        }

        [HttpGet("{page}/{pageSize}")]
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

        [HttpPatch("{id}/{pref}")]
        public async Task<ActionResult<UserDTO>> PatchPreference(int id, int pref)
        {
            if (_dbContext.Users == null)
                return NotFound();

            var user = await _dbContext.Users
                .Include(x => x.UserProfile)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
                return NotFound();

            user.UserProfile.PagePreference = pref;
            await _dbContext.SaveChangesAsync();

            var userDTO = UserToDTO(user);
            userDTO.Password = null;

            return userDTO;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            if (_dbContext.Users == null)
                return NotFound();

            return await _dbContext.Users
                .Select(x => UserToDTO(x))
                .ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<UserProfileDTO>> GetUser(int id)
        {
            if (_dbContext.Users == null)
                return NotFound();

            var user = await _dbContext.Users
                .Include(x => x.UserProfile)
                .FirstOrDefaultAsync(x => x.Id == id);
            //.FindAsync(id);
            if (user == null)
                return NotFound();

            int bodybuildersCount = await _dbContext.Bodybuilders
                .Where(x => x.UserId == id)
            .CountAsync();

            int coachesCount = await _dbContext.Coaches
                .Where(x => x.UserId == id)
            .CountAsync();

            int gymsCount = await _dbContext.Gyms
                .Where(x => x.UserId == id)
            .CountAsync();

            int contestsCount = await _dbContext.Contests
                .Where(x => x.UserId == id)
                .CountAsync();

            var userProfileDTO = new UserProfileDTO
            {
                Id = user.Id,
                Name = user.Name,
                Password = null,

                UserProfile = user.UserProfile,

                BodybuildersCount = bodybuildersCount,
                CoachesCount = contestsCount,
                GymsCount = gymsCount,
                ContestsCount = contestsCount
            };

            return userProfileDTO;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDTO userDTO)
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
        public async Task<ActionResult<UserDTO>> PostUser(UserDTO userDTO)
        {
            if (_dbContext.Users == null)
                return Problem("Entity set 'StoreContext.Users' is null.");

            var user = new User
            {
                Name = userDTO.Name,
                Password = userDTO.Password,
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser),
                new { id = user.Id },
                UserToDTO(user));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
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

        private bool UserExists(int id)
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
        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSetter.Secret); 
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, user.Id.ToString())
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

        private string GenerateConfirmationToken(User user)
        {
            string code = string.Empty;
            bool exists = true;

            while (exists)
            {
                code = GenerateRandomString(8);
                exists = _dbContext.ConfirmationCodes.Any(cc => cc.Code == code);
            }

            var confirmationCode = new ConfirmationCode
            {
                UserId = user.Id,
                Code = code,
                Expiration = DateTime.UtcNow.AddMinutes(10),
                Used = false
            };

            _dbContext.ConfirmationCodes.Add(confirmationCode);
            _dbContext.SaveChanges();

            return code;
        }

    }
}
