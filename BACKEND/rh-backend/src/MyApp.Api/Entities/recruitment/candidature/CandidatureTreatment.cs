using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("candidatures_treatments")]
public class CandidatureTreatment
{
    [Key]
    [Column("candidature_treatment_id")]
    public string Id { get; set; } = null!;

    [Column("candidature_detail_id")]
    public string CandidatureDetailId { get; set; } = null!;

    [Column("langage_speaking_id")]
    public string LangageSpeakingId { get; set; } = null!;

    [ForeignKey(nameof(CandidatureDetailId))]
    public CandidatureDetail CandidatureDetail { get; set; } = null!;

    [ForeignKey(nameof(LangageSpeakingId))]
    public LangageSpeaking LangageSpeaking { get; set; } = null!;
}
