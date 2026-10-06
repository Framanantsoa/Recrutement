using System.ComponentModel.DataAnnotations;
using MyApp.Api.Data;
using MyApp.Api.Models.dto.recruitment;

namespace MyApp.Api.Annotations;

public class ValidLangagesAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value,
     ValidationContext validationContext) {
        var dbContext = validationContext.GetService(typeof(AppDbContext)) as AppDbContext;

        if (dbContext == null)
            throw new Exception("DbContext non disponible.");

        var langages = value as IEnumerable<LangageSkillFormDTO>;

        if (langages == null || !langages.Any())
            return ValidationResult.Success;

        foreach (var lang in langages)
        {
            var langageExists = dbContext.LangagesSpeakings.Any(ls =>
                ls.LangageId==lang.LangageId && ls.SpeakingLevelId==lang.LevelId
            );

            if (langageExists==false)
                return new ValidationResult($"Le niveau ou la langue spécifié(e) n'existe pas.");
        }

        return ValidationResult.Success;
    }
}
