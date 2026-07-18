import { pool } from '../databases/connection';
import { Emprestimos } from '../models/Emprestimos';

type EmprestimoInput = Omit<Emprestimos, 'id_emprestimo' | 'data_devolucao' | 'criado_em' | 'atualizado_em'>;

export interface EmprestimoComDetalhes extends Emprestimos {
    titulo_livro: string;
    nome_cliente: string;
}

export class EmprestimoRepository {
    async criarEmprestimo(dados: EmprestimoInput): Promise<Emprestimos> {
        const query = `
            INSERT INTO emprestimos (id_livro, id_cliente, data_emprestimo)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const values = [dados.id_livro, dados.id_cliente, dados.data_emprestimo];

        const result = await pool.query<Emprestimos>(query, values);
        return result.rows[0];
    }

    async listarEmprestimos(): Promise<EmprestimoComDetalhes[]> {
        const query = `
            SELECT e.*, l.titulo AS titulo_livro, c.nome AS nome_cliente
            FROM emprestimos e
            INNER JOIN livros l ON e.id_livro = l.id_livro
            INNER JOIN clientes c ON e.id_cliente = c.id_cliente
            ORDER BY e.id_emprestimo ASC
        `;

        const result = await pool.query<EmprestimoComDetalhes>(query);
        return result.rows;
    }

    async buscarEmprestimoPorId(id: number): Promise<EmprestimoComDetalhes | null> {
        const query = `
            SELECT e.*, l.titulo AS titulo_livro, c.nome AS nome_cliente
            FROM emprestimos e
            INNER JOIN livros l ON e.id_livro = l.id_livro
            INNER JOIN clientes c ON e.id_cliente = c.id_cliente
            WHERE e.id_emprestimo = $1
        `;

        const result = await pool.query<EmprestimoComDetalhes>(query, [id]);
        return result.rows[0] || null;
    }

    async registrarDevolucao(id: number): Promise<Emprestimos | null> {
        const query = `
            UPDATE emprestimos
            SET data_devolucao = CURRENT_DATE,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id_emprestimo = $1
            RETURNING *
        `;

        const result = await pool.query<Emprestimos>(query, [id]);
        return result.rows[0] || null;
    }

    async excluirEmprestimo(id: number): Promise<boolean> {
        const query = `
            DELETE FROM emprestimos
            WHERE id_emprestimo = $1
        `;

        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
