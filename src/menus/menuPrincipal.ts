/*
    #MenuPrincipal
    - realiza a interação com o terminal e aciona as ações do sistema
    - mantém o menu ativo até que o usuário decida encerrar a aplicação
*/

import { LeitorPrompt } from '../utils/leitorPrompt';
import { ValidadorEntrada } from '../utils/validadorEntrada';

export class MenuPrincipal {
    private prompt: LeitorPrompt;

    constructor(prompt: LeitorPrompt) {
        this.prompt = prompt;
    }

    private mostrarOpcoes(): void {
        console.log('\n====================================');
        console.log('       BOOKSTORE MANAGER CLI        ');
        console.log('====================================');
        console.log('1. Autores [Gerenciamento]');
        console.log('2. Livros [Gerenciamento]');
        console.log('3. Clientes [Gerenciamento]');
        console.log('4. Empréstimos [Realizar/Devolver]');
        console.log('5. Relatórios [Estatísticas]');
        console.log('0. Encerrar Aplicação');
        console.log('====================================');
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

    private async abrirModulo(opcao: number): Promise<void> {
        switch (opcao) {
            case 1:
                this.mostrarSubmenu('Menu de Autores', ['Listar autores', 'Cadastrar autor', 'Editar autor', 'Excluir autor']);
                break;
            case 2:
                this.mostrarSubmenu('Menu de Livros', ['Listar livros', 'Cadastrar livro', 'Editar livro', 'Excluir livro']);
                break;
            case 3:
                this.mostrarSubmenu('Menu de Clientes', ['Listar clientes', 'Cadastrar cliente', 'Editar cliente', 'Excluir cliente']);
                break;
            case 4:
                this.mostrarSubmenu('Menu de Empréstimos', ['Realizar empréstimo', 'Devolver empréstimo', 'Listar empréstimos']);
                break;
            case 5:
                this.mostrarSubmenu('Menu de Relatórios', ['Relatório geral', 'Relatório por autor', 'Relatório por cliente']);
                break;
            default:
                console.log('--> Opção não reconhecida.');
                break;
        }

        await this.aguardarRetorno();
    }

    public async iniciar(): Promise<boolean> {
        let executando = true;
        let encerradoPeloUsuario = false;

        while (executando) {
            this.mostrarOpcoes();
            const entrada = await this.prompt.perguntar('Escolha uma opção: ');
            const opcao = ValidadorEntrada.validarOpcaoMenu(entrada, 0, 5);

            if (opcao === null) {
                console.clear();
                console.log('\x1b[31m%s\x1b[0m', `Opção inválida: "${entrada || 'vazia'}". Digite um número de 0 a 5.`);
                continue;
            }

            console.clear();

            if (opcao === 0) {
                encerradoPeloUsuario = true;
                executando = false;
                continue;
            }

            await this.abrirModulo(opcao);
            console.clear();
        }

        return encerradoPeloUsuario;
    }
}
