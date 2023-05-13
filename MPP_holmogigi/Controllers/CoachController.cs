using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MPP.Database;
using MPP.DTOs;
using MPP.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MPP.Controllers
{
    [Route("api/Coach")]
    [ApiController]
    public class CoachController : ControllerBase
    {
        private readonly BodyBuildersDatabasesContext _dbContext;

        public CoachController(BodyBuildersDatabasesContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("{page}/{pageSize}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Coach>>> GetAllPages(int page = 0, int pageSize = 10)
        {
            return await _dbContext.Coaches
                .Include(x => x.User)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CoachDTO>>> GetAll()
        {    
            return await _dbContext.Coaches
                .Select(x => CoachToDTO(x))
                .ToListAsync(); 
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Coach>> GetById(int id)
        {
            if (_dbContext.Coaches == null)
                return NotFound();

            var coach = await _dbContext.Coaches.
                Include(x => x.Gym)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (coach == null)
            {
                return NotFound();
            }

            return coach;
        }

        [HttpPost]
        public async Task<ActionResult<CoachDTO>> Create(CoachDTO coachDTO)
        {

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            // Validation
            if (coachDTO.Rate<1)
                return BadRequest("!ERROR! Invalid Rate!"); 

            var coach = new Coach
            {
                Name = coachDTO.Name,
                Age = coachDTO.Age,
                Rate = coachDTO.Rate,
                GymId = coachDTO.GymId,
                UserId = 1
            };
            _dbContext.Coaches.Add(coach);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id =  coach.Id },
                CoachToDTO(coach)
                );

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CoachDTO coachDTO)
        {
            if (id != coachDTO.Id)
            {
                return BadRequest();
            }

            var coach = await _dbContext.Coaches.FindAsync(id);
            if (coach == null)
            { 
                return NotFound();
            }

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 == AccessLevel.Regular && coach.UserId != extracted.Item1)
                return Unauthorized("You can only update your own entities.");

            coach.Name = coachDTO.Name;
            coach.Age = coachDTO.Age;
            coach. Rate = coachDTO.Rate;
            coach.GymId = coachDTO.GymId;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!CoachExisting(id))
            {
                return NotFound();
            }
            return NoContent();
        }

        private bool CheckAvailable(int id)
        {
            return (_dbContext.Coaches?.Any(x => x.Id == id)).GetValueOrDefault();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var coach = await _dbContext.Coaches.FindAsync(id);
            if (coach == null)
            {
                return NotFound();
            }

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 == AccessLevel.Regular && coach.UserId != extracted.Item1)
                return Unauthorized("You can only delete your own entities.");

            _dbContext.Coaches.Remove(coach);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("count/{pageSize}")]
        [AllowAnonymous]
        public async Task<int> GetTotalNumberOfPages(int pageSize = 10)
        {
            int total = await _dbContext.Coaches.CountAsync();
            int totalPages = total / pageSize;
            if (total % pageSize > 0)
                totalPages++;

            return totalPages;
        }



        private bool CoachExisting(int id)
        {
            return _dbContext.Coaches.Any(c => c.Id == id);
        }

        private static CoachDTO CoachToDTO(Coach coach) =>
            new CoachDTO
            {
                Id= coach.Id,
                Name= coach.Name,
                Age= coach.Age, 
                Rate= coach.Rate,
                GymId= coach.GymId
            };
    }

}
