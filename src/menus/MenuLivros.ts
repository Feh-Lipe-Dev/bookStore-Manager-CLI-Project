/*
    #MenuLivros
    - gerencia o submenu de livros (CRUD)
    - recebe prompt e livroController via injeção de dependência
*/

import { LeitorPrompt } from '../utils/leitorPrompt';
import { ValidadorEntrada } from '../utils/validadorEntrada';
import { LivroController } from '../controllers/LivroController';

export class MenuLivros {
    private prompt: LeitorPrompt;
    private livroController: LivroController;

    constructor(prompt: LeitorPrompt, livroController: LivroController) {
        this.prompt = prompt;
        this.livroController = livroController;
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

    private async processarSubmenu(opcao: number): Promise<void> {
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

    public async iniciar(): Promise<void> {
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

            await this.processarSubmenu(opcao);
            await this.aguardarRetorno();
        }
    }
}
