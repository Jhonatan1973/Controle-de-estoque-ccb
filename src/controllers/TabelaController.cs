using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

[ApiController]  // Marca a classe como um controlador de API
[Route("api/[controller]")]  // Define a rota base para o controlador (por exemplo, /api/tabela)
public class TabelaController : ControllerBase
{
    private readonly YourDbContext _context; // Altere para o nome do seu DbContext

    // Construtor para injeção de dependência do DbContext
    public TabelaController(YourDbContext context)
    {
        _context = context;
    }

    // GET api/tabela
    [HttpGet]  // Define o método HTTP como GET
    public async Task<ActionResult<IEnumerable<Tabela>>> GetTabela()
    {
        var tabela = await _context.Tabela.ToListAsync(); // Aqui você consulta o banco de dados
        return Ok(tabela);  // Retorna os dados em formato JSON
    }
}