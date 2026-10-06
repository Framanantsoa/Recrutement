using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("job_criteria")]
public class JobDescriptionCriteria : BaseEntity
{
    [Key]
    [Column("job_criteria_id")]
    public string Id { get; set; } = null!;

    [Column("job_description_id")]
    public string JobDescriptionId { get; set; } = null!;

    [Column("preselection_criteria_id")]
    public string PreselectionCriteriaId { get; set; } = null!;

    [Column("max_points")]
    public decimal MaxPoints { get; set; }

    [Column("validated_at")]
    public DateTime? ValidatedAt { get; set; }


// RELATIONS
    [ForeignKey(nameof(JobDescriptionId))]
    public JobDescription JobDescription { get; set; } = null!;

    [ForeignKey(nameof(PreselectionCriteriaId))]
    public PreselectionCriteria PreselectionCriteria { get; set; } = null!;


// COLLECTIONS
    public ICollection<JobCriteriaLevelEducation> LevelEducations { get; set; } = [];
    public ICollection<JobCriteriaFormation> Formations { get; set; } = [];
    public ICollection<JobCriteriaSpeaking> Speakings { get; set; } = [];
    public ICollection<JobCriteriaPresentation> Presentations { get; set; } = [];
    public ICollection<JobCriteriaExperience> Experiences { get; set; } = [];
}
