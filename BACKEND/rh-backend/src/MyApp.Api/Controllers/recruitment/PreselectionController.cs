using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Services.recruitment;

namespace MyApp.Api.Controllers.recruitment;

[ApiController]
[Route("api/recruitment/[controller]s")]
public class PreselectionController
(IPreselectionService _service)  : ControllerBase
{
    [HttpGet("langages")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllLangages() {
        if(!User.Identity?.IsAuthenticated ?? true) {
            return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        }

        try {
            var results = await _service.GetAllLangagesAsync();
            return Ok(new { data = results, status = 200, message = "success" });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("speaking-levels")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllSpeakingLevels() {
        if(!User.Identity?.IsAuthenticated ?? true) {
            return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        }

        try {
            var results = await _service.GetAllSpeakingLevelsAsync();
            return Ok(new { data = results, status = 200, message = "success" });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("criterias")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllCriterias() {
        if(!User.Identity?.IsAuthenticated ?? true) {
            return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        }

        try {
            var results = await _service.GetAllPreselectionCriteriaAsync();
            return Ok(new { data = results, status = 200, message = "success" });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpPost("job-criteria")]
    [AllowAnonymous]
    public async Task<IActionResult> AddJobCriteria([FromBody] JobCriteriaFormDTO dto) {
        if(!User.Identity?.IsAuthenticated ?? true) {
            return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        }

        try {
            await _service.AddJobPreselectionCriteria(dto);
            return Ok(new { data = (object?)null, status = 200, message = "Critères créés" });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpPut("job-criteria/{jobId}")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateJobCriteria(
        string jobId, [FromBody] JobCriteriaFormDTO dto
    ) {
        jobId = jobId.Replace("_", "/");

        if(!User.Identity?.IsAuthenticated ?? true) {
            return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        }
        
        try {
            var updated = await _service.UpdateJobPreselectionCriteria(jobId, dto);
            return Ok(new { data = updated, status = 200, message = "Critères mis à jour" });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpPut("job-criteria/{jobId}/confirm")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmCriteria(string jobId) {
        jobId = jobId.Replace("_", "/");

        if(!User.Identity?.IsAuthenticated ?? true) {
            return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        }
        
        try {
            string requestId =await _service.ConfirmCriteria(jobId);
            return Ok(new { data = requestId, status = 200, message = "Critères mis à jour" });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }
}
