/*
    #MenuPrincipal
    - realiza a interação com o terminal e aciona as ações do sistema
    - mantém o menu ativo até que o usuário decida encerrar a aplicação
*/

import { LeitorPrompt } from '../utils/leitorPrompt';
import { ValidadorEntrada } from '../utils/validadorEntrada';
import { AutorController } from '../controllers/AutorController';

export class MenuPrincipal {
    private prompt: LeitorPrompt;
    private autorController: AutorController;

    constructor(prompt: LeitorPrompt, autorController: AutorController) {
        this.prompt = prompt;
        this.autorController = autorController;
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

    private async cadastrarAutor(): Promise<void> {
        console.log('\n--- Cadastro de Autor ---');
        const nome = await this.prompt.perguntar('Nome: ');
        const nacionalidade = await this.prompt.perguntar('Nacionalidade (deixe vazio para omitir): ');
        const dataNascimento = await this.prompt.perguntar('Data de nascimento (AAAA-MM-DD) (deixe vazio para omitir): ');

        try {
            const dados: { nome: string; nacionalidade?: string | null; data_nascimento?: string | Date | null } = {
                nome
            };

            if (nacionalidade) {
                dados.nacionalidade = nacionalidade;
            }

            if (dataNascimento) {
                dados.data_nascimento = dataNascimento;
            }

            const autor = await this.autorController.criarAutor(dados);
            console.log('\x1b[32m%s\x1b[0m', `\nAutor cadastrado com sucesso! ID: ${autor.id_autor}`);
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async listarAutores(): Promise<void> {
        console.log('\n--- Lista de Autores ---');
        try {
            const autores = await this.autorController.listarAutores();

            if (autores.length === 0) {
                console.log('Nenhum autor cadastrado.');
                return;
            }

            autores.forEach(autor => {
                const dataFormatada = autor.data_nascimento
                    ? new Date(autor.data_nascimento).toLocaleDateString('pt-BR')
                    : 'Não informada';
                console.log(`ID: ${autor.id_autor} | Nome: ${autor.nome} | Nacionalidade: ${autor.nacionalidade || 'Não informada'} | Nascimento: ${dataFormatada} | Ativo: ${autor.ativo ? 'Sim' : 'Não'}`);
            });
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async buscarAutorPorId(): Promise<void> {
        console.log('\n--- Buscar Autor por ID ---');
        const idStr = await this.prompt.perguntar('Digite o ID do autor: ');
        const id = parseInt(idStr, 10);

        if (isNaN(id) || id <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID inválido.');
            return;
        }

        try {
            const autor = await this.autorController.buscarAutorPorId(id);

            if (!autor) {
                console.log('\x1b[33m%s\x1b[0m', 'Autor não encontrado.');
                return;
            }

            const dataFormatada = autor.data_nascimento
                ? new Date(autor.data_nascimento).toLocaleDateString('pt-BR')
                : 'Não informada';
            console.log(`ID: ${autor.id_autor} | Nome: ${autor.nome} | Nacionalidade: ${autor.nacionalidade || 'Não informada'} | Nascimento: ${dataFormatada} | Ativo: ${autor.ativo ? 'Sim' : 'Não'}`);
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async atualizarAutor(): Promise<void> {
        console.log('\n--- Atualizar Autor ---');
        const idStr = await this.prompt.perguntar('Digite o ID do autor a atualizar: ');
        const id = parseInt(idStr, 10);

        if (isNaN(id) || id <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID inválido.');
            return;
        }

        try {
            const autor = await this.autorController.buscarAutorPorId(id);

            if (!autor) {
                console.log('\x1b[33m%s\x1b[0m', 'Autor não encontrado.');
                return;
            }

            console.log(`Autor encontrado: ${autor.nome}`);
            console.log('Digite o novo valor ou pressione Enter para manter o atual:');

            const nome = await this.prompt.perguntar(`Nome (${autor.nome}): `);
            const nacionalidade = await this.prompt.perguntar(`Nacionalidade (${autor.nacionalidade || 'Não informada'}): `);
            const dataNascimento = await this.prompt.perguntar(`Data de nascimento (${autor.data_nascimento ? new Date(autor.data_nascimento).toLocaleDateString('pt-BR') : 'Não informada'}): `);

            const dados: { nome?: string; nacionalidade?: string | null; data_nascimento?: string | Date | null } = {};

            if (nome) {
                dados.nome = nome;
            }

            if (nacionalidade) {
                dados.nacionalidade = nacionalidade;
            }

            if (dataNascimento) {
                dados.data_nascimento = dataNascimento;
            }

            if (Object.keys(dados).length === 0) {
                console.log('Nenhuma alteração realizada.');
                return;
            }

            const autorAtualizado = await this.autorController.atualizarAutor(id, dados);

            if (autorAtualizado) {
                console.log('\x1b[32m%s\x1b[0m', '\nAutor atualizado com sucesso!');
            } else {
                console.log('\x1b[33m%s\x1b[0m', 'Nenhuma alteração foi aplicada.');
            }
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async excluirAutor(): Promise<void> {
        console.log('\n--- Excluir Autor ---');
        const idStr = await this.prompt.perguntar('Digite o ID do autor a excluir: ');
        const id = parseInt(idStr, 10);

        if (isNaN(id) || id <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID inválido.');
            return;
        }

        try {
            const autor = await this.autorController.buscarAutorPorId(id);

            if (!autor) {
                console.log('\x1b[33m%s\x1b[0m', 'Autor não encontrado.');
                return;
            }

            console.log(`Autor encontrado: ${autor.nome}`);
            const confirmacao = await this.prompt.perguntar('Tem certeza que deseja excluir? (s/n): ');

            if (confirmacao.toLowerCase() !== 's') {
                console.log('Exclusão cancelada.');
                return;
            }

            const excluido = await this.autorController.excluirAutor(id);

            if (excluido) {
                console.log('\x1b[32m%s\x1b[0m', '\nAutor excluído com sucesso!');
            } else {
                console.log('\x1b[31m%s\x1b[0m', '\nNão foi possível excluir o autor.');
            }
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async processarSubmenuAutores(opcao: number): Promise<void> {
        switch (opcao) {
            case 1:
                await this.listarAutores();
                break;
            case 2:
                await this.buscarAutorPorId();
                break;
            case 3:
                await this.cadastrarAutor();
                break;
            case 4:
                await this.atualizarAutor();
                break;
            case 5:
                await this.excluirAutor();
                break;
        }
    }

    private async abrirModulo(opcao: number): Promise<void> {
        switch (opcao) {
            case 1:
                await this.moduloAutores();
                break;
            case 2:
                this.mostrarSubmenu('Menu de Livros', ['Listar livros', 'Cadastrar livro', 'Editar livro', 'Excluir livro']);
                await this.aguardarRetorno();
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

    private async moduloAutores(): Promise<void> {
        let executando = true;

        while (executando) {
            console.clear();
            this.mostrarSubmenu('Menu de Autores', ['Listar autores', 'Buscar autor por ID', 'Cadastrar autor', 'Editar autor', 'Excluir autor']);
            const entrada = await this.prompt.perguntar('Escolha uma opção: ');
            const opcao = ValidadorEntrada.validarOpcaoMenu(entrada, 0, 5);

            if (opcao === null) {
                console.clear();
                console.log('\x1b[31m%s\x1b[0m', `Opção inválida: "${entrada || 'vazia'}". Digite um número de 0 a 4.`);
                await this.aguardarRetorno();
                continue;
            }

            if (opcao === 0) {
                executando = false;
                continue;
            }

            await this.processarSubmenuAutores(opcao);
            await this.aguardarRetorno();
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
