using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.Api.Entities.recruitment;
using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Services.recruitment;

namespace MyApp.Api.Controllers.recruitment;

[ApiController]
[Route("api/recruitment/job-interviews")]
public class JobInterviewController(IJobInterviewService s1) 
 : ControllerBase
{
    private readonly IJobInterviewService _service = s1;

    [HttpPost("planings")]
    [AllowAnonymous]
    public async Task<IActionResult> AddJobInterviewPlaning([FromBody] PlaningFormDTO plan) {
        try {
            await _service.AddPlaning(plan);
            return Ok(new { data = (object?)null, status = 200, message = "Planification ajoutée avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> AddJobInterview([FromBody] JobInterview interview) {
        try {
            await _service.AddJobInterview(interview);
            return Ok(new { data = (object?)null, status = 200, message = "Entretien ajouté avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("users/{userId}/can-plan/{jobDescId}")]
    [AllowAnonymous]
    public async Task<IActionResult> UserCanPlanJobInterview([FromRoute] string userId,
     [FromRoute] string jobDescId) {
        jobDescId = jobDescId.Replace("_", "/");

        try {
            var (canPlan, required) = await _service.CanUserPlanJobInterview(userId, jobDescId);
            var result = new { canPlan, required };

            return Ok(new { data = result, status = 200, message = "Vérification terminée avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("users/{userId}/can-plan-candidature/{candId}")]
    [AllowAnonymous]
    public async Task<IActionResult> UserCanPlanJobInterviewByCandidature([FromRoute] string userId,
     [FromRoute] string candId) {
        candId = candId.Replace("_", "/");

        try {
            var canPlan = await _service.CanUserPlanJobInterviewByCandidature(userId, candId);
            return Ok(new { data = canPlan, status = 200, message = "Vérification terminée avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("users/{userId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllJobInterviewsPlaning([FromRoute] string userId,
     [FromQuery] int? year, [FromQuery] int? month
    ) {
        try {
            var planings = await _service.GetPlaningsPerMonthAsync(userId, year, month);
            var result = new { planings, totalCount=planings.Count };

            return Ok(new { data = result, status = 200, message = "Planifications obtenues avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpPost("next-validator/{cadId}")]
    [AllowAnonymous]
    public async Task<IActionResult> PassToNextInterviewValidator([FromRoute] string cadId) {
        cadId = cadId.Replace("_", "/");

        try {
            await _service.PassToNextInterviewValidator(cadId);
            return Ok(new { data = (object?)null, status = 200, message = "Candidature passée au prochain validateur" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("users/{userId}/planings")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllPlaningsToDoForUser([FromRoute] string userId,
     [FromQuery] DateOnly? dateMin, [FromQuery] DateOnly? dateMax, [FromQuery] int page = 1, [FromQuery] int pageSize = 10
    ) {
        try {
            var planings = await _service.GetAllPlaningsToDoForUser(userId, dateMin, dateMax, page, pageSize);
            var result = new { planings = planings.Item1, totalCount = planings.Item2 };

            return Ok(new { data = result, status = 200, message = "Planifications obtenues avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpPut("planings/{planId}")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdatePlaning([FromRoute] string planId,
     [FromBody] UpdateDateTimeDTO data) {
        try {
            await _service.UpdatePlaningDatetime(planId, data.DateTime);
            return Ok(new { data = (object?)null, status = 200, message = "Planification mise à jour avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }
}
