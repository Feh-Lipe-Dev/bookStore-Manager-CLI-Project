import { LeitorPrompt } from '../utils/leitorPrompt';
import { ValidadorEntrada } from '../utils/validadorEntrada';
import { RelatorioController } from '../controllers/RelatorioController';

export class MenuRelatorios {
    private prompt: LeitorPrompt;
    private relatorioController: RelatorioController;

    constructor(prompt: LeitorPrompt, relatorioController: RelatorioController) {
        this.prompt = prompt;
        this.relatorioController = relatorioController;
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

    private async relatorioLivrosDisponiveis(): Promise<void> {
        console.log('\n--- Livros Disponíveis ---');
        try {
            const livros = await this.relatorioController.livrosDisponiveis();

            if (livros.length === 0) {
                console.log('Nenhum livro disponível no momento.');
                return;
            }

            livros.forEach(livro => {
                console.log(`ID: ${livro.id_livro} | Título: ${livro.titulo} | Autor: ${livro.nome_autor} | Disponível: ${livro.quantidade_disponivel}`);
            });

            console.log(`\nTotal: ${livros.length} livro(s) disponível(is)`);
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async relatorioLivrosEmprestados(): Promise<void> {
        console.log('\n--- Livros Emprestados (Em Aberto) ---');
        try {
            const emprestimos = await this.relatorioController.livrosEmprestados();

            if (emprestimos.length === 0) {
                console.log('Nenhum livro emprestado no momento.');
                return;
            }

            emprestimos.forEach(emp => {
                const dataFormatada = new Date(emp.data_emprestimo).toLocaleDateString('pt-BR');
                console.log(`Empréstimo #${emp.id_emprestimo} | Livro: ${emp.titulo} | Cliente: ${emp.nome_cliente} | Retirado em: ${dataFormatada}`);
            });

            console.log(`\nTotal: ${emprestimos.length} empréstimo(s) em aberto`);
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async relatorioLivrosPorAutor(): Promise<void> {
        console.log('\n--- Livros Cadastrados por Autor ---');
        try {
            const resultado = await this.relatorioController.livrosCadastradosPorAutor();

            if (resultado.length === 0) {
                console.log('Nenhum registro encontrado.');
                return;
            }

            resultado.forEach(item => {
                console.log(`Autor: ${item.nome_autor} | Total de livros: ${item.total_livros}`);
            });
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async relatorioEmprestimosPorLivro(): Promise<void> {
        console.log('\n--- Empréstimos por Livro ---');
        try {
            const resultado = await this.relatorioController.emprestimosPorLivro();

            if (resultado.length === 0) {
                console.log('Nenhum registro encontrado.');
                return;
            }

            resultado.forEach(item => {
                console.log(`Livro: ${item.titulo} | Autor: ${item.nome_autor} | Empréstimos: ${item.total_emprestimos}`);
            });
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async relatorioClientesComEmprestimosAtivos(): Promise<void> {
        console.log('\n--- Clientes com Empréstimos Ativos ---');
        try {
            const clientes = await this.relatorioController.clientesComEmprestimosAtivos();

            if (clientes.length === 0) {
                console.log('Nenhum cliente com empréstimo ativo.');
                return;
            }

            clientes.forEach(cliente => {
                console.log(`Cliente: ${cliente.nome_cliente} | Email: ${cliente.email} | Empréstimos ativos: ${cliente.emprestimos_ativos}`);
            });
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async relatorioEmprestimosPorPeriodo(): Promise<void> {
        console.log('\n--- Empréstimos por Período (Mensal) ---');
        try {
            const resultado = await this.relatorioController.emprestimosPorPeriodo();

            if (resultado.length === 0) {
                console.log('Nenhum empréstimo registrado.');
                return;
            }

            resultado.forEach(item => {
                const [ano, mes] = item.periodo.split('-');
                const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                const nomeMes = meses[parseInt(mes, 10) - 1];
                console.log(`${nomeMes}/${ano} | Empréstimos: ${item.total_emprestimos}`);
            });
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async relatorioRankingClientes(): Promise<void> {
        console.log('\n--- Ranking de Clientes por Total de Empréstimos ---');
        try {
            const ranking = await this.relatorioController.rankingClientes();

            if (ranking.length === 0) {
                console.log('Nenhum empréstimo registrado.');
                return;
            }

            ranking.forEach((cliente, index) => {
                const posicao = index + 1;
                console.log(`${posicao}º | Cliente: ${cliente.nome_cliente} | Email: ${cliente.email} | Empréstimos: ${cliente.total_emprestimos}`);
            });
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async processarSubmenu(opcao: number): Promise<void> {
        switch (opcao) {
            case 1:
                await this.relatorioLivrosDisponiveis();
                break;
            case 2:
                await this.relatorioLivrosEmprestados();
                break;
            case 3:
                await this.relatorioLivrosPorAutor();
                break;
            case 4:
                await this.relatorioEmprestimosPorLivro();
                break;
            case 5:
                await this.relatorioClientesComEmprestimosAtivos();
                break;
            case 6:
                await this.relatorioEmprestimosPorPeriodo();
                break;
            case 7:
                await this.relatorioRankingClientes();
                break;
        }
    }

    public async iniciar(): Promise<void> {
        let executando = true;

        while (executando) {
            console.clear();
            this.mostrarSubmenu('Menu de Relatórios', [
                'Livros disponíveis',
                'Livros emprestados (em aberto)',
                'Livros cadastrados por autor',
                'Empréstimos por livro',
                'Clientes com empréstimos ativos',
                'Empréstimos por período (mensal)',
                'Ranking de clientes por empréstimos'
            ]);
            const entrada = await this.prompt.perguntar('Escolha uma opção: ');
            const opcao = ValidadorEntrada.validarOpcaoMenu(entrada, 0, 7);

            if (opcao === null) {
                console.clear();
                console.log('\x1b[31m%s\x1b[0m', `Opção inválida: "${entrada || 'vazia'}". Digite um número de 0 a 7.`);
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
