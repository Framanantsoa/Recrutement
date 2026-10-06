using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("candidatures_langages")]
public class CandidatureLangage
{
    [Key]
    [Column("candidature_langage_id")]
    public string Id { get; set; } = null!;

    [Column("candidature_detail_id")]
    public string CandidatureDetailId { get; set; } = null!;

    [Column("langage_speaking_id")]
    public string LangageSpeakingId { get; set; } = null!;


// RELATIONS
    [ForeignKey(nameof(CandidatureDetailId))]
    public CandidatureDetail CandidatureDetail { get; set; } = null!;

    [ForeignKey(nameof(LangageSpeakingId))]
    public LangageSpeaking LangageSpeaking { get; set; } = null!;
}
