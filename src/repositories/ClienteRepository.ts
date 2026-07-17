import { pool } from '../databases/connection';
import { Clientes } from '../models/Clientes';

type ClienteInput = Omit<Clientes, 'id_cliente' | 'criado_em' | 'atualizado_em'>;

export class ClienteRepository {
    async criarCliente(dados: ClienteInput): Promise<Clientes> {
        const query = `
            INSERT INTO clientes (nome, email, telefone, ativo)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [dados.nome, dados.email, dados.telefone, dados.ativo];

        const result = await pool.query<Clientes>(query, values);
        return result.rows[0];
    }

    async listarClientes(): Promise<Clientes[]> {
        const query = `
            SELECT *
            FROM clientes
            ORDER BY id_cliente ASC
        `;

        const result = await pool.query<Clientes>(query);
        return result.rows;
    }

    async buscarClientePorId(id: number): Promise<Clientes | null> {
        const query = `
            SELECT *
            FROM clientes
            WHERE id_cliente = $1
        `;

        const result = await pool.query<Clientes>(query, [id]);
        return result.rows[0] || null;
    }

    async atualizarCliente(id: number, dados: Partial<Clientes>): Promise<Clientes | null> {
        const campos: string[] = [];
        const values: unknown[] = [];
        let index = 1;

        if (dados.nome !== undefined) {
            campos.push(`nome = $${index}`);
            values.push(dados.nome);
            index++;
        }
        //campos = [`nome=$1`,`email=$2`, telefone=undefined, `ativo=$3` ]
        if (dados.email !== undefined) {
            campos.push(`email = $${index}`);
            values.push(dados.email);
            index++;
        }

        if (dados.telefone !== undefined) {
            campos.push(`telefone = $${index}`);
            values.push(dados.telefone);
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
            UPDATE clientes
            SET ${campos.join(', ')}
            WHERE id_cliente = $${index}
            RETURNING *
        `;

        values.push(id);

        const result = await pool.query<Clientes>(query, values);
        return result.rows[0] || null;
    }

    async excluirCliente(id: number): Promise<boolean> {
        const query = `
            DELETE FROM clientes
            WHERE id_cliente = $1
        `;

        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
