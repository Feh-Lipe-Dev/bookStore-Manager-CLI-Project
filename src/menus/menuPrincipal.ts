/*
    #MenuPrincipal
    - realiza a interação com o terminal e aciona as ações do sistema
    - mantém o menu ativo até que o usuário decida encerrar a aplicação
*/

import { LeitorPrompt } from '../utils/leitorPrompt';
import { ValidadorEntrada } from '../utils/validadorEntrada';
import { MenuAutores } from './menuAutores';
import { MenuLivros } from './menuLivros';

export class MenuPrincipal {
    private prompt: LeitorPrompt;
    private menuAutores: MenuAutores;
    private menuLivros: MenuLivros;

    constructor(prompt: LeitorPrompt, menuAutores: MenuAutores, menuLivros: MenuLivros) {
        this.prompt = prompt;
        this.menuAutores = menuAutores;
        this.menuLivros = menuLivros;
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
                await this.menuAutores.iniciar();
                break;
            case 2:
                await this.menuLivros.iniciar();
                break;
            case 3:
                this.mostrarSubmenu('Menu de Clientes', ['Listar clientes', 'Cadastrar cliente', 'Editar cliente', 'Excluir cliente']);
                await this.aguardarRetorno();
                break;
            case 4:
                this.mostrarSubmenu('Menu de Empréstimos', ['Realizar empréstimo', 'Devolver empréstimo', 'Listar empréstimos']);
                await this.aguardarRetorno();
                break;
            case 5:
                this.mostrarSubmenu('Menu de Relatórios', ['Relatório geral', 'Relatório por autor', 'Relatório por cliente']);
                await this.aguardarRetorno();
                break;
            default:
                console.log('--> Opção não reconhecida.');
                await this.aguardarRetorno();
                break;
        }
    }

    public async iniciar(): Promise<boolean> {
        let executando = true;
        let encerradoPeloUsuario = false;

        while (executando) {
            console.clear();
            this.mostrarOpcoes();
            const entrada = await this.prompt.perguntar('Escolha uma opção: ');
            const opcao = ValidadorEntrada.validarOpcaoMenu(entrada, 0, 5);

            if (opcao === null) {
                console.clear();
                console.log('\x1b[31m%s\x1b[0m', `Opção inválida: "${entrada || 'vazia'}". Digite um número de 0 a 5.`);
                await this.aguardarRetorno();
                continue;
            }

            if (opcao === 0) {
                encerradoPeloUsuario = true;
                executando = false;
                continue;
            }

            await this.abrirModulo(opcao);
        }

        return encerradoPeloUsuario;
    }
}
