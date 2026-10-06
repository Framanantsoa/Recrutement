using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("job_interviews")]
public class JobInterview : BaseEntity
{
    [Key]
    [Column("job_interview_id")]
    public string Id { get; set; } = null!;

    [Column("planification_id")]
    public string PlaningId { get; set; } = null!;

    [Column("is_done")]
    public bool IsDone { get; set; } = false;

    [Column("done_at")]
    public DateTime? DoneAt { get; set; }


    [Column("job_interview_datetime")]
    public DateTime DateTime { get; set; }


    [ForeignKey(nameof(PlaningId))]
    public Planing Planing { get; set; } = null!;
}
