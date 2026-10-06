using System.ComponentModel.DataAnnotations;
using MyApp.Api.Data;

namespace MyApp.Api.Annotations;

public class ExistsLevelEducationAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value,
     ValidationContext validationContext) {
        if (value == null)
            return ValidationResult.Success;

        var dbContext = validationContext.GetService(typeof(AppDbContext)) as AppDbContext;

        if (dbContext == null)
            throw new Exception("DbContext non disponible.");

        var exists = dbContext.LevelEducations
            .Any(le => le.Id == value.ToString());

        if (!exists)
            return new ValidationResult("Le niveau d'étude n'existe pas.");

        return ValidationResult.Success;
    }
}
