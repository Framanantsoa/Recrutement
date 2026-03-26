using Microsoft.EntityFrameworkCore.Storage;
using MyApp.Api.Data;

namespace MyApp.Api.Services;

public interface IUnitOfWorkService
{
    Task BeginTransactionAsync();
    Task CommitAsync();
    Task RollbackAsync();
    Task SaveChangesAsync();
}


public class UnitOfWorkService : IUnitOfWorkService
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWorkService(AppDbContext context) {
        _context = context;
    }

    public async Task BeginTransactionAsync() {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitAsync() {
        if (_transaction == null)
            throw new ArgumentNullException("Transaction pas encore initialisée.");

        await _context.SaveChangesAsync();
        await _transaction.CommitAsync();

        await _transaction.DisposeAsync();
        _transaction = null;   // IMPORTANT
    }

    public async Task RollbackAsync() {
        if (_transaction == null)
            throw new ArgumentNullException("Transaction pas encore initialisée.");
            
        await _transaction.RollbackAsync();
        await _transaction.DisposeAsync();
        _transaction = null;   // IMPORTANT
    }

    public async Task SaveChangesAsync() {
        await _context.SaveChangesAsync();
    }
}
