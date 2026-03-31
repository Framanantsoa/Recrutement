using MyApp.Api.Entities.recruitment;

namespace MyApp.Api.Models.dto.recruitment;

public class PreselectionCriteriaDTO
{
    public List<PreselectionCriteriaWithScoreDTO> Criteria { get; set; } = [];
    public decimal TotalScore { get; set; }
}

public class PreselectionCriteriaWithScoreDTO
{
    public string Id { get; set; } = null!;
    public string Criteria { get; set; } = null!;
    public decimal Coefficient { get; set; }
    public decimal Score { get; set; }
}


public class UpdateCriteriaCoefficientDTO
{
    public decimal Coefficient { get; set; }
}


public class JobCriteriaFormDTO
{
    public string JobDescId { get; set; } = null!;
    public string MinLevelEducationId { get; set; } = null!;
    public short MinExperienceYears { get; set; }
    public List<LangageSkillFormDTO> Langages { get; set; } = [];
}

public class SpeakingCriteriaDTO
{
    public string Langage { get; set; } = null!;
    public string Level { get; set; } = null!;
}

public class JobCriteriaDTO
{
    public string CriteriaThresholdId { get; set; } = null!;
    public short MinExperienceYears { get; set; }
    public string MinLevelEducationId { get; set; } = null!;
    public string MinLevelEducation { get; set; } = null!;
    public List<SpeakingCriteriaDTO> SpeakingCriteria { get; set; } = [];
}
