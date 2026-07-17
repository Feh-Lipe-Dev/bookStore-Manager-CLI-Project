import { pool } from '../databases/connection';
import { Livro } from '../models/Livros';

type LivroInput = Omit<Livro, 'id_livro' | 'criado_em' | 'atualizado_em'>;

export class LivroRepository {
    async criarLivro(dados: LivroInput): Promise<Livro> {
        const query = `
            INSERT INTO livros (titulo, id_autor, quantidade_disponivel, ativo)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [dados.titulo, dados.id_autor, dados.quantidade_disponivel, dados.ativo];

        const result = await pool.query<Livro>(query, values);
        return result.rows[0];
    }

    async listarLivros(): Promise<Livro[]> {
        const query = `
            SELECT *
            FROM livros
            ORDER BY id_livro ASC
        `;

        const result = await pool.query<Livro>(query);
        return result.rows;
    }

    async buscarLivroPorId(id: number): Promise<Livro | null> {
        const query = `
            SELECT *
            FROM livros
            WHERE id_livro = $1
        `;

        const result = await pool.query<Livro>(query, [id]);
        return result.rows[0] || null;
    }

    async atualizarLivro(id: number, dados: Partial<Livro>): Promise<Livro | null> {
        const campos: string[] = [];
        const values: unknown[] = [];
        let index = 1;

        if (dados.titulo !== undefined) {
            campos.push(`titulo = $${index}`);
            values.push(dados.titulo);
            index++;
        }

        if (dados.id_autor !== undefined) {
            campos.push(`id_autor = $${index}`);
            values.push(dados.id_autor);
            index++;
        }

        if (dados.quantidade_disponivel !== undefined) {
            campos.push(`quantidade_disponivel = $${index}`);
            values.push(dados.quantidade_disponivel);
            index++;
        }

        if (dados.ativo !== undefined) {
            campos.push(`ativo = $${index}`);
            values.push(dados.ativo);
            index++;
        }

        if (campos.length === 0) {
            return null;
        }

        campos.push('atualizado_em = CURRENT_TIMESTAMP');

        const query = `
            UPDATE livros
            SET ${campos.join(', ')}
            WHERE id_livro = $${index}
            RETURNING *
        `;

        values.push(id);

        const result = await pool.query<Livro>(query, values);
        return result.rows[0] || null;
    }

    async excluirLivro(id: number): Promise<boolean> {
        const query = `
            DELETE FROM livros
            WHERE id_livro = $1
        `;

        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
