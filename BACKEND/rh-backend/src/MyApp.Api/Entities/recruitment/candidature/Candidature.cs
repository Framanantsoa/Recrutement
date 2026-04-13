using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("candidatures")]
public class Candidature : BaseEntity
{
    [Key]
    [Column("candidature_id")]
    public string Id { get; set; } = null!;

    [Column("first_name")]
    public string FirstName { get; set; } = null!;

    [Column("last_name")]
    public string LastName { get; set; } = null!;

    [Column("email_contact")]
    public string EmailContact { get; set; } = null!;

    [Column("cv_url")]
    public string? CvUrl { get; set; }

    [Column("lm_url")]
    public string? LmUrl { get; set; }

    [Column("is_treated")]
    public bool IsTreated { get; set; } = false;

    [Column("treated_at")]
    public DateTime? TreatedAt { get; set; }

    [Column("job_description_id")]
    public string JobDescriptionId { get; set; } = null!;

    [ForeignKey(nameof(JobDescriptionId))]
    public JobDescription JobDescription { get; set; } = null!;

    [Column("is_preselected")]
    public bool? IsPreselected { get; set; }

// =============================
// Navigation properties
// =============================
    public ICollection<CandidatureDetail> CandidatureDetails { get; set; } = [];
    public ICollection<CandidatureFormation> CandidatureFormations { get; set; } = [];
    public ICollection<CandidatureScore> CandidatureScores { get; set; } = [];
}
