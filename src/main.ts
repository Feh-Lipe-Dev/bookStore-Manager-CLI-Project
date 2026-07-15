import 'dotenv/config';
import { pool } from './databases/connection';

console.log('Aplicação iniciada - main.ts.');

async function main() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Conexão com o BD estabelecida com sucesso!');
        console.log(result.rows[0]);

    } catch (err) {
        console.error('Erro ao conectar no banco:', err);
    } finally {
        await pool.end();
    }
}

main();