using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MPP.Database;
using MPP.DTOs;
using MPP.Models;
using System.Drawing.Text;
using System.Runtime.CompilerServices;

namespace MPP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BodyBuildersController : ControllerBase
    {
        private readonly BodyBuildersDatabasesContext _dbContext;

        public BodyBuildersController(BodyBuildersDatabasesContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BodybuilderDTO>>> GetAll()
        {

            return await _dbContext.Bodybuilders.Select(b => BdtoDTO(b)).ToListAsync();
        }

        [HttpGet("{page}/{pageSize}")]
        public async Task<ActionResult<IEnumerable<BodybuilderDTO>>> GetAllPages(int page=0, int pageSize =10)
        {
            return await _dbContext.Bodybuilders.Select(b => BdtoDTO(b))
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BodybuilderDTO>> GetById(int id)
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

            return BdtoDTO(body);
        }

        [HttpPost]
        public async Task<ActionResult<BodybuilderDTO>> Create(BodybuilderDTO bodybuilder)
        {
            // Validation
            if (bodybuilder.Age<1 || bodybuilder.Age > 122)
                return BadRequest("!ERROR! Invalid Age!");

            var Body = new Bodybuilder
            {
                Name = bodybuilder.Name,
                Age = bodybuilder.Age,
                Weight = bodybuilder.Weight,
                Height = bodybuilder.Height,
                Division = bodybuilder.Division
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
            if (id != bodybuilder.Id)
            {
                return BadRequest();
            }

            var bdToUpate = await _dbContext.Bodybuilders.FindAsync(id);
            if (bdToUpate == null)
            {
                return NotFound();
            }

            bdToUpate.Name = bodybuilder.Name;
            bdToUpate.Age = bodybuilder.Age;
            bdToUpate.Weight = bodybuilder.Weight;
            bdToUpate.Height = bodybuilder.Height;
            bdToUpate.Division = bodybuilder.Division;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!BdExists(id))
            {
                return NotFound();
            }

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

            _dbContext.Bodybuilders.Remove(bodybuilder);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("filter/{Age}/{page}/{pageSize}")]
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
            };

            _dbContext.Contests.Add (contestt);
            await _dbContext.SaveChangesAsync ();

            return CreatedAtAction(nameof(PostContest), contest);
        }


        [HttpGet("{page}/{pageSize}/contest")]
        public async Task<ActionResult<IEnumerable<ContestDTO>>> GetAllPagesContest(int page = 0, int pageSize = 10)
        {
            return await _dbContext.Contests.Select(c => ContesttoDTO(c))
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        [HttpGet("{id},{id2}/contest")]
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