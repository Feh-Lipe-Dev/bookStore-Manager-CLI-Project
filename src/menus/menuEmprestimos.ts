import { LeitorPrompt } from '../utils/leitorPrompt';
import { ValidadorEntrada } from '../utils/validadorEntrada';
import { EmprestimoController } from '../controllers/EmprestimoController';

export class MenuEmprestimos {
    private prompt: LeitorPrompt;
    private emprestimoController: EmprestimoController;

    constructor(prompt: LeitorPrompt, emprestimoController: EmprestimoController) {
        this.prompt = prompt;
        this.emprestimoController = emprestimoController;
    }

    private mostrarSubmenu(titulo: string, opcoes: string[]): void {
        console.log(`\n===== ${titulo} =====`);
        opcoes.forEach((opcao, index) => console.log(`${index + 1}. ${opcao}`));
        console.log('0. Voltar ao menu principal');
        console.log('====================');
    }

    private async aguardarRetorno(): Promise<void> {
        await this.prompt.perguntar('Pressione Enter para voltar ao menu principal...');
    }

    private async realizarEmprestimo(): Promise<void> {
        console.log('\n--- Realizar Empréstimo ---');
        const idLivroStr = await this.prompt.perguntar('ID do livro: ');
        const idClienteStr = await this.prompt.perguntar('ID do cliente: ');

        const idLivro = parseInt(idLivroStr, 10);
        const idCliente = parseInt(idClienteStr, 10);

        if (isNaN(idLivro) || idLivro <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID do livro inválido.');
            return;
        }

        if (isNaN(idCliente) || idCliente <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID do cliente inválido.');
            return;
        }

        try {
            const emprestimo = await this.emprestimoController.criarEmprestimo({
                id_livro: idLivro,
                id_cliente: idCliente
            });

            console.log('\x1b[32m%s\x1b[0m', `\nEmpréstimo realizado com sucesso! ID: ${emprestimo.id_emprestimo}`);
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async devolverEmprestimo(): Promise<void> {
        console.log('\n--- Devolver Empréstimo ---');
        const idStr = await this.prompt.perguntar('ID do empréstimo: ');
        const id = parseInt(idStr, 10);

        if (isNaN(id) || id <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID inválido.');
            return;
        }

        try {
            const emprestimo = await this.emprestimoController.buscarEmprestimoPorId(id);

            if (!emprestimo) {
                console.log('\x1b[33m%s\x1b[0m', 'Empréstimo não encontrado.');
                return;
            }

            console.log(`Empréstimo encontrado: Livro "${emprestimo.titulo_livro}" para ${emprestimo.nome_cliente}`);
            console.log(`Data do empréstimo: ${new Date(emprestimo.data_emprestimo).toLocaleDateString('pt-BR')}`);

            if (emprestimo.data_devolucao) {
                console.log('\x1b[33m%s\x1b[0m', 'Este empréstimo já foi devolvido.');
                return;
            }

            const confirmacao = await this.prompt.perguntar('Confirmar devolução? (s/n): ');

            if (confirmacao.toLowerCase() !== 's') {
                console.log('\x1b[31m%s\x1b[0m', 'Devolução cancelada.');
                return;
            }

            const devolvido = await this.emprestimoController.registrarDevolucao(id);

            if (devolvido) {
                console.log('\x1b[32m%s\x1b[0m', '\nDevolução registrada com sucesso!');
            } else {
                console.log('\x1b[31m%s\x1b[0m', '\nNão foi possível registrar a devolução.');
            }
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async listarEmprestimos(): Promise<void> {
        console.log('\n--- Lista de Empréstimos ---');
        try {
            const emprestimos = await this.emprestimoController.listarEmprestimos();

            if (emprestimos.length === 0) {
                console.log('Nenhum empréstimo registrado.');
                return;
            }

            emprestimos.forEach(emp => {
                const dataEmprestimo = new Date(emp.data_emprestimo).toLocaleDateString('pt-BR');
                const dataDevolucao = emp.data_devolucao
                    ? new Date(emp.data_devolucao).toLocaleDateString('pt-BR')
                    : 'Pendente';
                const status = emp.data_devolucao ? 'Devolvido' : 'Em aberto';

                console.log(`ID: ${emp.id_emprestimo} | Livro: ${emp.titulo_livro} | Cliente: ${emp.nome_cliente} | Empréstimo: ${dataEmprestimo} | Devolução: ${dataDevolucao} | Status: ${status}`);
            });
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async buscarEmprestimoPorId(): Promise<void> {
        console.log('\n--- Buscar Empréstimo por ID ---');
        const idStr = await this.prompt.perguntar('Digite o ID do empréstimo: ');
        const id = parseInt(idStr, 10);

        if (isNaN(id) || id <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID inválido.');
            return;
        }

        try {
            const emprestimo = await this.emprestimoController.buscarEmprestimoPorId(id);

            if (!emprestimo) {
                console.log('\x1b[33m%s\x1b[0m', 'Empréstimo não encontrado.');
                return;
            }

            console.log(`ID: ${emprestimo.id_emprestimo}\nTítulo: ${emprestimo.titulo_livro}\nCliente: ${emprestimo.nome_cliente}\nRetirado em: ${emprestimo.data_emprestimo.toLocaleDateString('pt-BR')}\nDevolvido em: ${emprestimo.data_devolucao ? emprestimo.data_devolucao.toLocaleDateString('pt-BR') : 'No aguardo'}`);
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async processarSubmenu(opcao: number): Promise<void> {
        switch (opcao) {
            case 1:
                await this.realizarEmprestimo();
                break;
            case 2:
                await this.devolverEmprestimo();
                break;
            case 3:
                await this.listarEmprestimos();
                break;
            case 4:
                await this.buscarEmprestimoPorId();
                break;
        }
    }

    public async iniciar(): Promise<void> {
        let executando = true;

        while (executando) {
            console.clear();
            this.mostrarSubmenu('Menu de Empréstimos', ['Realizar empréstimo', 'Devolver empréstimo', 'Listar empréstimos', 'Buscar empréstimo por ID']);
            const entrada = await this.prompt.perguntar('Escolha uma opção: ');
            const opcao = ValidadorEntrada.validarOpcaoMenu(entrada, 0, 4);

            if (opcao === null) {
                console.clear();
                console.log('\x1b[31m%s\x1b[0m', `Opção inválida: "${entrada || 'vazia'}". Digite um número de 0 a 3.`);
                await this.aguardarRetorno();
                continue;
            }

            if (opcao === 0) {
                executando = false;
                continue;
            }

            await this.processarSubmenu(opcao);
            await this.aguardarRetorno();
        }
    }
}
