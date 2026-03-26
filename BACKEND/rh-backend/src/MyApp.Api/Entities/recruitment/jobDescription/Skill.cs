using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("job_skills")]
public class Skill
{
    [Key]
    [Column("job_skill_id")]
    public string Id { get; set; } = null!;

    
    [Column("job_description_id")]
    public string JobDescriptionId { get; set; } = null!;

    [ForeignKey(nameof(JobDescriptionId))]
    public JobDescription JobDescription { get; set; } = null!;
    

    [Column("skill")]
    public string Label { get; set; } = null!;
}
