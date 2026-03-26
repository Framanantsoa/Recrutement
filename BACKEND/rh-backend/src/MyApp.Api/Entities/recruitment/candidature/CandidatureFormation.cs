using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("candidatures_formations")]
public class CandidatureFormation
{
    [Key]
    [Column("candidature_formation_id")]
    public string Id { get; set; } = null!;

    [Column("candidature_id")]
    public string CandidatureId { get; set; } = null!;

    [Column("formation")]
    public string Formation { get; set; } = null!;


// RELATIONS
    [ForeignKey(nameof(CandidatureId))]
    public Candidature Candidature { get; set; } = null!;
}
