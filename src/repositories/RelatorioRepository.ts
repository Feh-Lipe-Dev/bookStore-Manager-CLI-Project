import { pool } from '../databases/connection';
import { LivroDisponivel, LivroEmprestado, LivrosPorAutor, EmprestimosPorLivro, ClienteComEmprestimoAtivo, EmprestimosPorPeriodo, RankingCliente } from '../models/Relatorio';

export class RelatorioRepository {
    async livrosDisponiveis(): Promise<LivroDisponivel[]> {
        const query = `
            SELECT l.id_livro, l.titulo, a.nome AS nome_autor, l.quantidade_disponivel
            FROM livros l
            INNER JOIN autores a ON l.id_autor = a.id_autor
            WHERE l.quantidade_disponivel > 0 AND l.ativo = TRUE
            ORDER BY l.titulo ASC
        `;

        const result = await pool.query<LivroDisponivel>(query);
        return result.rows;
    }

    async livrosEmprestados(): Promise<LivroEmprestado[]> {
        const query = `
            SELECT e.id_emprestimo, l.titulo, c.nome AS nome_cliente, e.data_emprestimo
            FROM emprestimos e
            INNER JOIN livros l ON e.id_livro = l.id_livro
            INNER JOIN clientes c ON e.id_cliente = c.id_cliente
            WHERE e.data_devolucao IS NULL
            ORDER BY e.data_emprestimo ASC
        `;

        const result = await pool.query<LivroEmprestado>(query);
        return result.rows;
    }

    async livrosCadastradosPorAutor(): Promise<LivrosPorAutor[]> {
        const query = `
            SELECT a.nome AS nome_autor, COUNT(l.id_livro) AS total_livros
            FROM autores a
            LEFT JOIN livros l ON a.id_autor = l.id_autor
            WHERE a.ativo = TRUE
            GROUP BY a.id_autor, a.nome
            ORDER BY total_livros DESC
        `;

        const result = await pool.query<LivrosPorAutor>(query);
        return result.rows;
    }

    async emprestimosPorLivro(): Promise<EmprestimosPorLivro[]> {
        const query = `
            SELECT l.titulo, a.nome AS nome_autor, COUNT(e.id_emprestimo) AS total_emprestimos
            FROM livros l
            INNER JOIN autores a ON l.id_autor = a.id_autor
            LEFT JOIN emprestimos e ON l.id_livro = e.id_livro
            GROUP BY l.id_livro, l.titulo, a.nome
            ORDER BY total_emprestimos DESC
        `;

        const result = await pool.query<EmprestimosPorLivro>(query);
        return result.rows;
    }

    async clientesComEmprestimosAtivos(): Promise<ClienteComEmprestimoAtivo[]> {
        const query = `
            SELECT c.nome AS nome_cliente, c.email, COUNT(e.id_emprestimo) AS emprestimos_ativos
            FROM clientes c
            INNER JOIN emprestimos e ON c.id_cliente = e.id_cliente
            WHERE e.data_devolucao IS NULL
            GROUP BY c.id_cliente, c.nome, c.email
            ORDER BY emprestimos_ativos DESC
        `;

        const result = await pool.query<ClienteComEmprestimoAtivo>(query);
        return result.rows;
    }

    async emprestimosPorPeriodo(): Promise<EmprestimosPorPeriodo[]> {
        const query = `
            SELECT TO_CHAR(data_emprestimo, 'YYYY-MM') AS periodo, COUNT(id_emprestimo) AS total_emprestimos
            FROM emprestimos
            GROUP BY TO_CHAR(data_emprestimo, 'YYYY-MM')
            ORDER BY periodo DESC
        `;

        const result = await pool.query<EmprestimosPorPeriodo>(query);
        return result.rows;
    }

    async rankingClientes(): Promise<RankingCliente[]> {
        const query = `
            SELECT c.nome AS nome_cliente, c.email, COUNT(e.id_emprestimo) AS total_emprestimos
            FROM clientes c
            INNER JOIN emprestimos e ON c.id_cliente = e.id_cliente
            GROUP BY c.id_cliente, c.nome, c.email
            ORDER BY total_emprestimos DESC
        `;

        const result = await pool.query<RankingCliente>(query);
        return result.rows;
    }
}
