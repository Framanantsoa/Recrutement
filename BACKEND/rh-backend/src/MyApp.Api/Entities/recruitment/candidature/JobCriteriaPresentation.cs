using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("job_criteria_presentations")]
public class JobCriteriaPresentation
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("job_criteria_id")]
    public string JobCriteriaId { get; set; } = null!;

    [Column("points")]
    public decimal Points { get; set; }

    // RELATIONS
    [ForeignKey(nameof(JobCriteriaId))]
    public JobDescriptionCriteria JobCriteria { get; set; } = null!;
}