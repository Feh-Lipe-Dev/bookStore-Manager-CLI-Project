import 'dotenv/config';
import { pool } from './databases/connection';
import { LeitorPrompt } from './utils/leitorPrompt';
import { MenuPrincipal } from './menus/MenuPrincipal';
import { MenuAutores } from './menus/MenuAutores';
import { MenuLivros } from './menus/MenuLivros';
import { MenuClientes } from './menus/MenuClientes';
import { MenuEmprestimos } from './menus/MenuEmprestimos';
import { MenuRelatorios } from './menus/MenuRelatorios';
import { AutorController } from './controllers/AutorController';
import { LivroController } from './controllers/LivroController';
import { ClienteController } from './controllers/ClienteController';
import { EmprestimoController } from './controllers/EmprestimoController';
import { RelatorioController } from './controllers/RelatorioController';

console.log('Aplicação iniciada.');

async function inicializar() {
    const prompt = new LeitorPrompt();
    const autorController = new AutorController();
    const livroController = new LivroController();
    const clienteController = new ClienteController();
    const emprestimoController = new EmprestimoController();
    const relatorioController = new RelatorioController();

    const menuAutores = new MenuAutores(prompt, autorController);
    const menuLivros = new MenuLivros(prompt, livroController);
    const menuClientes = new MenuClientes(prompt, clienteController);
    const menuEmprestimos = new MenuEmprestimos(prompt, emprestimoController);
    const menuRelatorios = new MenuRelatorios(prompt, relatorioController);
    const menuPrincipal = new MenuPrincipal(prompt, menuAutores, menuLivros, menuClientes, menuEmprestimos, menuRelatorios);

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
