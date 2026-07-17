import 'dotenv/config';
import { pool } from './databases/connection';
import { LeitorPrompt } from './utils/leitorPrompt';
import { MenuPrincipal } from './menus/menuPrincipal';
import { AutorController } from './controllers/AutorController';
import { LivroController } from './controllers/LivroController';

console.log('Aplicação iniciada.');

async function inicializar() {
    const prompt = new LeitorPrompt();
    const autorController = new AutorController();
    const livroController = new LivroController();
    const menuPrincipal = new MenuPrincipal(prompt, autorController, livroController);

    try {
        const conexaoBD = await pool.query('SELECT NOW()');
        console.log('Conexão com o banco de dados estabelecida.');
        console.log(conexaoBD.rows[0]);

        const encerrouPeloUsuario = await menuPrincipal.iniciar();

        if (encerrouPeloUsuario) {
            console.log('Encerrando a aplicação. Obrigado por utilizar o BookStore Manager!');
        }
    } catch (erro) {
        console.error('Ocorreu um erro crítico na aplicação:', erro);
    } finally {
        prompt.fecharLeitor();
        await pool.end();
        process.exit(0);
    }
}

inicializar();
