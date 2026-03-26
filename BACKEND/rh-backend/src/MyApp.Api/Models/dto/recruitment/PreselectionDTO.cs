using MyApp.Api.Entities.recruitment;

namespace MyApp.Api.Models.dto.recruitment;

public class PreselectionCriterionDTO
{
    public List<PreselectionCriterionWithScoreDTO> Criteria { get; set; } = [];
    public decimal TotalScore { get; set; }
}

public class PreselectionCriterionWithScoreDTO
{
    public string Id { get; set; } = null!;
    public string Criterion { get; set; } = null!;
    public decimal Coefficient { get; set; }
    public decimal Score { get; set; }
}


public class UpdateCriterionCoefficientDTO
{
    public decimal Coefficient { get; set; }
}
