import { pool } from '../databases/connection';
import { Autores } from '../models/Autores';

type AutorInput = Omit<Autores, 'id_autor' | 'criado_em' | 'atualizado_em'>;

export class AutorRepository {
    async criarAutor(dados: AutorInput): Promise<Autores> {
        const query = `
            INSERT INTO autores (nome, nacionalidade, data_nascimento, ativo)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [dados.nome, dados.nacionalidade ?? null, dados.data_nascimento ?? null, dados.ativo];

        const result = await pool.query<Autores>(query, values);
        return result.rows[0];
    }

    async listarAutores(): Promise<Autores[]> {
        const query = `
            SELECT *
            FROM autores
            ORDER BY id_autor ASC
        `;

        const result = await pool.query<Autores>(query);
        return result.rows;
    }

    async buscarAutorPorId(id: number): Promise<Autores | null> {
        const query = `
            SELECT *
            FROM autores
            WHERE id_autor = $1
        `;

        const result = await pool.query<Autores>(query, [id]);
        return result.rows[0] || null;
    }

    async atualizarAutor(id: number, dados: Partial<Autores>): Promise<Autores | null> {
        const campos: string[] = [];
        const values: unknown[] = [];
        let index = 1;

        if (dados.nome !== undefined) {
            campos.push(`nome = $${index}`);
            values.push(dados.nome);
            index++;
        }

        if (dados.nacionalidade !== undefined) {
            campos.push(`nacionalidade = $${index}`);
            values.push(dados.nacionalidade ?? null);
            index++;
        }

        if (dados.data_nascimento !== undefined) {
            campos.push(`data_nascimento = $${index}`);
            values.push(dados.data_nascimento ?? null);
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
            UPDATE autores
            SET ${campos.join(', ')}
            WHERE id_autor = $${index}
            RETURNING *
        `;

        values.push(id);

        const result = await pool.query<Autores>(query, values);
        return result.rows[0] || null;
    }

    async excluirAutor(id: number): Promise<boolean> {
        const query = `
            DELETE FROM autores
            WHERE id_autor = $1
        `;

        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
