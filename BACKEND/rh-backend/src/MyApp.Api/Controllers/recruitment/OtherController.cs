using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.Api.Repositories.recruitment;

namespace MyApp.Api.Controllers.recruitment;

[ApiController]
[Route("api/recruitment/params")]
public class OtherController(IJobDescriptionRepository repo) 
 : ControllerBase
{
    private readonly IJobDescriptionRepository _repo = repo;


    [HttpGet("level-educations")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllLevelEducations() {
        if(!User.Identity?.IsAuthenticated ?? true) {
            return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        }

        try {
            var results = await _repo.GetAllLevelEducations();
            return Ok(new { data = results, status = 200, message = "Niveaux d'études trouvées avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("post-types")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllPostTypes() {
        if(!User.Identity?.IsAuthenticated ?? true) {
            return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        }

        try {
            var results = await _repo.GetAllPostTypes();
            return Ok(new { data = results, status = 200, message = "Types de poste trouvés avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }
}
