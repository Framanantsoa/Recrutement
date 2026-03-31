using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Services.recruitment;

namespace MyApp.Api.Controllers.recruitment;

[ApiController]
[Route("api/recruitment/[controller]s")]
public class CandidatureController(ICandidatureService s1) 
 : ControllerBase
{
    private readonly ICandidatureService _service = s1;

    [HttpGet("job-descriptions/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCandidaturesByJobDescriptionId(
     [FromRoute] string id, [FromQuery] CandidatureFiltersDTO filters,
     [FromQuery] int page=1, [FromQuery] int pageSize=10) {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        id = id.Replace("_", "/");
        try {
            var (candidatures, details) = await _service.GetByJobDescriptionIdAsync(
                id, filters, page, pageSize
            );

            var result = new {
                Details = details, Candidatures = candidatures, 
                TotalCount = candidatures.Count(), Page = page, PageSize = pageSize
            };

            return Ok(new { data = result, status = 200, message = "Candidatures récupérées avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCandidatureDetails([FromRoute] string id) {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        id = id.Replace("_", "/");
        try {
            var (criteria, details) = await _service.GetCandidatureDetailsAsync(id);
            var result = new { criteria, details };

            return Ok(new { data = result, status = 200, message = "Candidature récupérée avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpPost("job-descriptions/{id}")]  
    [AllowAnonymous]
    public async Task<IActionResult> PostCandidature([FromRoute] string id,
     [FromBody] CandidatureFormDTO data) {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        id = id.Replace("_", "/");
        try {
            await _service.AddCandidature(id, data);
            return Ok(new { data = (object?)null, status = 200, message = "Candidature reçue avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCandidatureNote([FromRoute] string id, 
     [FromBody] CandidatureNoteUpdateFormDTO data) {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        id = id.Replace("_", "/");
        try {
            await _service.UpdateCriteriaPoints(id, data.CriteriaId, data.Points);
            return Ok(new { data = (object?)null,
             status = 200, message = "Candidature mise à jour avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpPut("{id}/finish")]
    public async Task<IActionResult> FinishCandidatureTreatment([FromRoute] string id) {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        id = id.Replace("_", "/");
        try {
            await _service.FinishCandidatureTreatment(id);
            return Ok(new { data = (object?)null,
             status = 200, message = "Candidature traitée avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


// ===================== COMMENTAIRES =====================

    [HttpGet("{id}/comments")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCandidatureComments(
        [FromRoute] string id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        id = id.Replace("_", "/");
        try {
            var comments = await _service.GetPaginatedCommentsAsync(id, page, pageSize);

            return Ok(new {
                data = comments,
                status = 200,
                message = "Commentaires récupérés avec succès"
            });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpPost("{id}/comments")]
    [AllowAnonymous]
    public async Task<IActionResult> AddCandidatureComment(
        [FromRoute] string id,
        [FromBody] CandidatureCommentFormDTO data)
    {
        id = id.Replace("_", "/");
        try {
            await _service.AddCandidatureComment(id, data);

            return Ok(new {
                data = (object?)null,
                status = 200,
                message = "Commentaire ajouté avec succès"
            });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpPut("comments/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateCandidatureComment(
        [FromRoute] string id,
        [FromBody] CandidatureCommentFormDTO data)
    {
        id = id.Replace("_", "/");
        try {
            await _service.UpdateCandidatureComment(id, data);

            return Ok(new {
                data = (object?)null,
                status = 200,
                message = "Commentaire mis à jour avec succès"
            });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpDelete("comments/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteCandidatureComment([FromRoute] string id)
    {
        id = id.Replace("_", "/");
        try {
            await _service.DeleteCandidatureComment(id);

            return Ok(new {
                data = (object?)null,
                status = 200,
                message = "Commentaire supprimé avec succès"
            });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }
}
