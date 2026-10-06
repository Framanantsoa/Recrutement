using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyApp.Api.Entities.users;

namespace MyApp.Api.Entities.recruitment;

[Table("planifications")]
public class Planing : BaseEntity
{
    [Key]
    [Column("planification_id")]
    public string Id { get; set; } = null!;

    [Column("candidature_id")]
    public string CandidatureId { get; set; } = null!;

    [Column("validator_id")]
    public string ValidatorId { get; set; } = null!;

    [Column("planified_datetime")]
    public DateTime? DateTime { get; set; }


    [ForeignKey(nameof(CandidatureId))]
    public Candidature Candidature { get; set; } = null!;

    [ForeignKey(nameof(ValidatorId))]
    public User Validator { get; set; } = null!;


// COLLECTIONS
    public ICollection<JobInterview> JobInterviews { get; set; } = [];
}
