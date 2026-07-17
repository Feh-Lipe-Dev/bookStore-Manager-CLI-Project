import 'dotenv/config';
import { pool } from './databases/connection';
import { LeitorPrompt } from './utils/leitorPrompt';
import { MenuPrincipal } from './menus/menuPrincipal';
import { MenuAutores } from './menus/menuAutores';
import { MenuLivros } from './menus/menuLivros';
import { MenuClientes } from './menus/menuClientes';
import { MenuEmprestimos } from './menus/menuEmprestimos';
import { AutorController } from './controllers/AutorController';
import { LivroController } from './controllers/LivroController';
import { ClienteController } from './controllers/ClienteController';
import { EmprestimoController } from './controllers/EmprestimoController';

console.log('Aplicação iniciada.');

async function inicializar() {
    const prompt = new LeitorPrompt();
    const autorController = new AutorController();
    const livroController = new LivroController();
    const clienteController = new ClienteController();
    const emprestimoController = new EmprestimoController();
  
    const menuAutores = new MenuAutores(prompt, autorController);
    const menuLivros = new MenuLivros(prompt, livroController);
    const menuClientes = new MenuClientes(prompt, clienteController);
    const menuEmprestimos = new MenuEmprestimos(prompt, emprestimoController);
    const menuPrincipal = new MenuPrincipal(prompt, menuAutores, menuLivros, menuClientes, menuEmprestimos);

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
