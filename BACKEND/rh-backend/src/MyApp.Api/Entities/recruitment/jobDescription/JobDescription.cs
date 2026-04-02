using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("job_descriptions")]
public class JobDescription : BaseEntity
{
    [Key]
    [Column("job_description_id")]
    public string Id { get; set; } = null!;

    [Column("mission")]
    public string Mission { get; set; } = null!;

    [Column("last_status")]
    public string LastStatus { get; set; } = null!;

    [Column("request_id")]
    public string RequestId { get; set; } = null!;

    [Column("post_type_id")]
    public string PostTypeId { get; set; } = null!;

// RELATIONS
    [ForeignKey(nameof(RequestId))]
    public RecruitmentRequest Request { get; set; } = null!;

    [ForeignKey(nameof(PostTypeId))]
    public PostType PostType { get; set; } = null!;

// Collections
    public ICollection<Attribution> Attributions { get; set; } = [];
    public ICollection<Experience> Experiences { get; set; } = [];
    public ICollection<Formation> Formations { get; set; } = [];
    public ICollection<JobDescriptionSoftSkill> SoftSkills { get; set; } = [];
    public ICollection<Skill> Skills { get; set; } = [];
    public ICollection<JobDescriptionValidation> Validations { get; set; } = [];
    
    public ICollection<JobDescriptionCriteria> Criteria { get; set; } = [];

    public ICollection<Candidature> Candidates { get; set; } = [];
}
