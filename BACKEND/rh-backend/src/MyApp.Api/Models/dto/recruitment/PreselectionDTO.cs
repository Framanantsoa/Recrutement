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


public class LevelEducationCriteriaForm
{
    public string LevelId { get; set; } = null!;
    public decimal Points { get; set; }
}

public class ExperienceCriteriaForm
{
    public short Minimum { get; set; }
    public short Maximum { get; set; }
    public decimal Points { get; set; }
}

public class LangageSkillCriteriaForm
{
    public string LangageId { get; set; } = null!;
    public string LevelId { get; set; } = null!;
    public decimal Points { get; set; }
}

public class JobCriteriaFormDTO
{
    public string JobDescId { get; set; } = null!;
    public List<LevelEducationCriteriaForm> LevelEducation { get; set; } = null!;
    public List<ExperienceCriteriaForm> Experiences { get; set; } = [];
    public List<LangageSkillCriteriaForm> Langages { get; set; } = [];

    public decimal FormationsPoints { get; set; }
    public decimal PresentationsPoints { get; set; }
    public decimal ExperiencesPoints { get; set; }
    public decimal LangagesPoints { get; set; }
    public decimal LevelEducationsPoints { get; set; }
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
