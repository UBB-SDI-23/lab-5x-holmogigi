using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MPP.Database;
using MPP.DTOs;
using MPP.Models;
using System.Drawing.Text;
using System.Runtime.CompilerServices;

namespace MPP.Controllers
{
    [Route("api/Bodybuilders")]
    [ApiController]

    public class BodyBuildersController : ControllerBase
    {
        private readonly BodyBuildersDatabasesContext _dbContext;

        public BodyBuildersController(BodyBuildersDatabasesContext dbContext)
        {
            _dbContext = dbContext;
        }


        [HttpGet("{page}/{pageSize}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Bodybuilder>>> GetAllPages(int page = 0, int pageSize = 10)
        {
            return await _dbContext.Bodybuilders
                .Include(x => x.User)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Bodybuilder>> GetById(int id)
        {
            if (_dbContext.Bodybuilders == null)
            {
                return NotFound();
            }
            var body = await _dbContext.Bodybuilders.FindAsync(id);

            if (body == null)
            {
                return NotFound();
            }

            return body;
        }

        [HttpPost]
        public async Task<ActionResult<BodybuilderDTO>> Create(BodybuilderDTO bodybuilder)
        {
            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            // Validation
            if (bodybuilder.Age < 1 || bodybuilder.Age > 122)
                return BadRequest("!ERROR! Invalid Age!");

            var Body = new Bodybuilder
            {
                Name = bodybuilder.Name,
                Age = bodybuilder.Age,
                Weight = bodybuilder.Weight,
                Height = bodybuilder.Height,
                Division = bodybuilder.Division,
                UserId = (int?)extracted.Item1,
            };

            _dbContext.Bodybuilders.Add(Body);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = Body.Id },
                BdtoDTO(Body));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, BodybuilderDTO bodybuilder)
        {
           
            var bdToUpate = await _dbContext.Bodybuilders.FindAsync(id);
            if (bdToUpate == null)
            {
                return NotFound();
            }

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 == AccessLevel.Regular && bdToUpate.UserId != extracted.Item1)
                return Unauthorized("You can only update your own entities.");

            bdToUpate.Name = bodybuilder.Name;
            bdToUpate.Age = bodybuilder.Age;
            bdToUpate.Weight = bodybuilder.Weight;
            bdToUpate.Height = bodybuilder.Height;
            bdToUpate.Division = bodybuilder.Division;

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool CheckAvailable(int id)
        {
            return (_dbContext.Bodybuilders?.Any(x => x.Id == id)).GetValueOrDefault();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (_dbContext == null)
            {
                return NotFound();
            }
            var bodybuilder = await _dbContext.Bodybuilders.FindAsync(id);

            if (bodybuilder == null)
            {
                return NotFound();
            }

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 == AccessLevel.Regular && bodybuilder.UserId != extracted.Item1)
                return Unauthorized("You can only delete your own entities.");

            _dbContext.Bodybuilders.Remove(bodybuilder);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("filter/{Age}/{page}/{pageSize}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<BodybuilderDTO>>> FilterAge(int Age, int page = 0, int pageSize = 10)
        {
            if (_dbContext.Bodybuilders == null)
            {
                return NotFound();
            }
           
            return await _dbContext.Bodybuilders.
                Where(X => X.Age > Age)
                .Select(X => BdtoDTO(X))
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
        

        [HttpPost("contest")]
        public async Task<ActionResult<ContestDTO>> PostContest (ContestDTO contest)
        {
            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");
   
            if (contest.Name.Length < 2 || contest.Location.Length < 2)
                return BadRequest("!ERROR! Invalid Name or Location!");

            var CoachId = contest.CoachId;
            var BodybuilderId = contest.BodybuilderId;
            var bd = await _dbContext.Bodybuilders.FindAsync (BodybuilderId);
            var coach = await _dbContext.Coaches.FindAsync (CoachId);

            if ( bd==null || coach==null)
                return NotFound();

            var contestt = new Contest
            {
                Bodybuilder = bd,
                Coach = coach,
                DateTime = DateTime.Now,
                Name = contest.Name,
                Location = contest.Location,
                UserId = (int?)extracted.Item1,
            };

            _dbContext.Contests.Add (contestt);
            await _dbContext.SaveChangesAsync ();

            return CreatedAtAction(nameof(PostContest), contest);
        }


        [HttpGet("{page}/{pageSize}/contest")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Contest>>> GetAllPagesContest(int page = 0, int pageSize = 10)
        {
            return await _dbContext.Contests
                .Include(X => X.User)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        [HttpGet("{id},{id2}/contest")]
        [AllowAnonymous]
        public async Task<ActionResult<Contest>> GetByIdContest(int id, int id2)
        {
            if (_dbContext.Contests == null)
            {
                return NotFound();
            }
            var body = await _dbContext.Contests.Include(x => x.Bodybuilder).Include(x => x.Coach).FirstOrDefaultAsync(x => x.BodybuilderId == id && x.CoachId == id2);
          
            if (body == null)
            {
                return NotFound();
            }

            return body;
        }


        [HttpPut("{id},{id2}/contest")]
        public async Task<IActionResult> UpdateContest(int id, int id2, ContestDTO contest)
        {
            var contestToUpate = await _dbContext.Contests.FindAsync(id, id2);
            if (contestToUpate == null)
            {
                return NotFound();
            }

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 == AccessLevel.Regular && contestToUpate.UserId != extracted.Item1)
                return Unauthorized("You can only update your own entities.");

            contestToUpate.DateTime = (DateTime)contest.DateTime;
            contestToUpate.Name = contest.Name;
            contestToUpate.Location = contest.Location;
            contestToUpate.CoachId = contest.CoachId;
            contestToUpate.BodybuilderId = contest.BodybuilderId;

           await _dbContext.SaveChangesAsync();

           return NoContent();
        }

        [HttpDelete("{id},{id2}/contest")]
        public async Task<IActionResult> DeleteContest(int id, int id2)
        {
            if (_dbContext == null)
            {
                return NotFound();
            }
            var bodybuilder = await _dbContext.Contests.FindAsync(id,id2);

            if (bodybuilder == null)
            {
                return NotFound();
            }

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 == AccessLevel.Regular && bodybuilder.UserId != extracted.Item1)
                return Unauthorized("You can only delete your own entities.");

            _dbContext.Contests.Remove(bodybuilder);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        private static BodybuilderDTO BdtoDTO(Bodybuilder bd) =>
            new BodybuilderDTO
            {
                Id = bd.Id,
                Name = bd.Name,
                Age = bd.Age,
                Weight = bd.Weight,
                Height = bd.Height,
                Division = bd.Division
            };

        private static ContestDTO ContesttoDTO(Contest ct) =>
           new ContestDTO
           {
               CoachId = ct.CoachId,
               BodybuilderId = ct.BodybuilderId,
               DateTime = ct.DateTime,
               Name = ct.Name,
               Location = ct.Location,
           };

        private bool BdExists(int id)
            {
                return (_dbContext.Bodybuilders?.Any(b => b.Id == id)).GetValueOrDefault();
            }
    }
}