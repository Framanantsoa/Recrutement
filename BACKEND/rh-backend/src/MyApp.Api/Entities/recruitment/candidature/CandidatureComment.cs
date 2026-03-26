using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyApp.Api.Entities.users;

namespace MyApp.Api.Entities.recruitment;

[Table("candidatures_comments")]
public class CandidatureComment : BaseEntity
{
    [Key]
    [Column("comment_id")]
    public string Id { get; set; } = null!;

    [Column("comment", TypeName = "nvarchar(max)")]
    public string Comment { get; set; } = null!;

    [Column("user_id")]
    public string UserId { get; set; } = null!;

    [Column("candidature_id")]
    public string CandidatureId { get; set; } = null!;

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [ForeignKey(nameof(CandidatureId))]
    public Candidature Candidature { get; set; } = null!;

    [Column("is_deleted")]
    public bool IsDeleted { get; set; }

    [Column("deleted_at")]
    public DateTime DeletedAt { get; set; }
}
