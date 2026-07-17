/*
    #MenuPrincipal
    - realiza a interação com o terminal e aciona as ações do sistema
    - mantém o menu ativo até que o usuário decida encerrar a aplicação
*/

import { LeitorPrompt } from '../utils/leitorPrompt';
import { ValidadorEntrada } from '../utils/validadorEntrada';
import { AutorController } from '../controllers/AutorController';
import { LivroController } from '../controllers/LivroController';

export class MenuPrincipal {
    private prompt: LeitorPrompt;
    private autorController: AutorController;
    private livroController: LivroController;

    constructor(prompt: LeitorPrompt, autorController: AutorController, livroController: LivroController) {
        this.prompt = prompt;
        this.autorController = autorController;
        this.livroController = livroController;
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

    private async cadastrarLivro(): Promise<void> {
        console.log('\n--- Cadastro de Livro ---');
        const titulo = await this.prompt.perguntar('Título: ');
        const idAutorStr = await this.prompt.perguntar('ID do autor: ');
        const quantidadeStr = await this.prompt.perguntar('Quantidade disponível (padrão: 0): ');

        const idAutor = parseInt(idAutorStr, 10);

        if (isNaN(idAutor) || idAutor <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID do autor inválido.');
            return;
        }

        try {
            const dados: { titulo: string; id_autor: number; quantidade_disponivel?: number } = {
                titulo,
                id_autor: idAutor
            };

            if (quantidadeStr) {
                const quantidade = parseInt(quantidadeStr, 10);
                if (!isNaN(quantidade) && quantidade >= 0) {
                    dados.quantidade_disponivel = quantidade;
                }
            }

            const livro = await this.livroController.criarLivro(dados);
            console.log('\x1b[32m%s\x1b[0m', `\nLivro cadastrado com sucesso! ID: ${livro.id_livro}`);
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async listarLivros(): Promise<void> {
        console.log('\n--- Lista de Livros ---');
        try {
            const livros = await this.livroController.listarLivros();

            if (livros.length === 0) {
                console.log('Nenhum livro cadastrado.');
                return;
            }

            livros.forEach(livro => {
                console.log(`ID: ${livro.id_livro} | Título: ${livro.titulo} | ID Autor: ${livro.id_autor} | Disponível: ${livro.quantidade_disponivel} | Ativo: ${livro.ativo ? 'Sim' : 'Não'}`);
            });
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async buscarLivroPorId(): Promise<void> {
        console.log('\n--- Buscar Livro por ID ---');
        const idStr = await this.prompt.perguntar('Digite o ID do livro: ');
        const id = parseInt(idStr, 10);

        if (isNaN(id) || id <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID inválido.');
            return;
        }

        try {
            const livro = await this.livroController.buscarLivroPorId(id);

            if (!livro) {
                console.log('\x1b[33m%s\x1b[0m', 'Livro não encontrado.');
                return;
            }

            console.log(`ID: ${livro.id_livro} | Título: ${livro.titulo} | ID Autor: ${livro.id_autor} | Disponível: ${livro.quantidade_disponivel} | Ativo: ${livro.ativo ? 'Sim' : 'Não'}`);
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async atualizarLivro(): Promise<void> {
        console.log('\n--- Atualizar Livro ---');
        const idStr = await this.prompt.perguntar('Digite o ID do livro a atualizar: ');
        const id = parseInt(idStr, 10);

        if (isNaN(id) || id <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID inválido.');
            return;
        }

        try {
            const livro = await this.livroController.buscarLivroPorId(id);

            if (!livro) {
                console.log('\x1b[33m%s\x1b[0m', 'Livro não encontrado.');
                return;
            }

            console.log(`Livro encontrado: ${livro.titulo}`);
            console.log('Digite o novo valor ou pressione Enter para manter o atual:');

            const titulo = await this.prompt.perguntar(`Título (${livro.titulo}): `);
            const idAutorStr = await this.prompt.perguntar(`ID do autor (${livro.id_autor}): `);
            const quantidadeStr = await this.prompt.perguntar(`Quantidade disponível (${livro.quantidade_disponivel}): `);

            const dados: { titulo?: string; id_autor?: number; quantidade_disponivel?: number } = {};

            if (titulo) {
                dados.titulo = titulo;
            }

            if (idAutorStr) {
                const idAutor = parseInt(idAutorStr, 10);
                if (!isNaN(idAutor) && idAutor > 0) {
                    dados.id_autor = idAutor;
                }
            }

            if (quantidadeStr) {
                const quantidade = parseInt(quantidadeStr, 10);
                if (!isNaN(quantidade) && quantidade >= 0) {
                    dados.quantidade_disponivel = quantidade;
                }
            }

            if (Object.keys(dados).length === 0) {
                console.log('Nenhuma alteração realizada.');
                return;
            }

            const livroAtualizado = await this.livroController.atualizarLivro(id, dados);

            if (livroAtualizado) {
                console.log('\x1b[32m%s\x1b[0m', '\nLivro atualizado com sucesso!');
            } else {
                console.log('\x1b[33m%s\x1b[0m', 'Nenhuma alteração foi aplicada.');
            }
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async excluirLivro(): Promise<void> {
        console.log('\n--- Excluir Livro ---');
        const idStr = await this.prompt.perguntar('Digite o ID do livro a excluir: ');
        const id = parseInt(idStr, 10);

        if (isNaN(id) || id <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID inválido.');
            return;
        }

        try {
            const livro = await this.livroController.buscarLivroPorId(id);

            if (!livro) {
                console.log('\x1b[33m%s\x1b[0m', 'Livro não encontrado.');
                return;
            }

            console.log(`Livro encontrado: ${livro.titulo}`);
            const confirmacao = await this.prompt.perguntar('Tem certeza que deseja excluir? (s/n): ');

            if (confirmacao.toLowerCase() !== 's') {
                console.log('Exclusão cancelada.');
                return;
            }

            const excluido = await this.livroController.excluirLivro(id);

            if (excluido) {
                console.log('\x1b[32m%s\x1b[0m', '\nLivro excluído com sucesso!');
            } else {
                console.log('\x1b[31m%s\x1b[0m', '\nNão foi possível excluir o livro.');
            }
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async processarSubmenuLivros(opcao: number): Promise<void> {
        switch (opcao) {
            case 1:
                await this.listarLivros();
                break;
            case 2:
                await this.buscarLivroPorId();
                break;
            case 3:
                await this.cadastrarLivro();
                break;
            case 4:
                await this.atualizarLivro();
                break;
            case 5:
                await this.excluirLivro();
                break;
        }
    }

    private async abrirModulo(opcao: number): Promise<void> {
        switch (opcao) {
            case 1:
                await this.moduloAutores();
                break;
            case 2:
                await this.moduloLivros();
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

    private async moduloLivros(): Promise<void> {
        let executando = true;

        while (executando) {
            console.clear();
            this.mostrarSubmenu('Menu de Livros', ['Listar livros', 'Buscar livro por ID', 'Cadastrar livro', 'Editar livro', 'Excluir livro']);
            const entrada = await this.prompt.perguntar('Escolha uma opção: ');
            const opcao = ValidadorEntrada.validarOpcaoMenu(entrada, 0, 5);

            if (opcao === null) {
                console.clear();
                console.log('\x1b[31m%s\x1b[0m', `Opção inválida: "${entrada || 'vazia'}". Digite um número de 0 a 5.`);
                await this.aguardarRetorno();
                continue;
            }

            if (opcao === 0) {
                executando = false;
                continue;
            }

            await this.processarSubmenuLivros(opcao);
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
