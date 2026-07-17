import { LivroRepository } from '../repositories/LivroRepository';
import { Livro } from '../models/Livros';

export class LivroService {
    private repository: LivroRepository;

    constructor(repository: LivroRepository) {
        this.repository = repository;
    }

    async criarLivro(dados: { titulo: string; id_autor: number; quantidade_disponivel?: number; ativo?: boolean }) {
        if (!dados.titulo || dados.titulo.trim() === '') {
            throw new Error('O título do livro é obrigatório.');
        }

        const titulo = dados.titulo.trim();

        if (titulo.length < 2) {
            throw new Error('O título do livro deve ter pelo menos 2 caracteres.');
        }

        if (!Number.isInteger(dados.id_autor) || dados.id_autor <= 0) {
            throw new Error('O ID do autor é obrigatório e deve ser um número inteiro positivo.');
        }

        const quantidadeDisponivel = dados.quantidade_disponivel ?? 0;

        if (quantidadeDisponivel < 0) {
            throw new Error('A quantidade disponível não pode ser negativa.');
        }

        return this.repository.criarLivro({
            titulo,
            id_autor: dados.id_autor,
            quantidade_disponivel: quantidadeDisponivel,
            ativo: dados.ativo ?? true
        });
    }

    async listarLivros() {
        return this.repository.listarLivros();
    }

    async buscarLivroPorId(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID do livro inválido.');
        }

        return this.repository.buscarLivroPorId(id);
    }

    async atualizarLivro(id: number, dados: Partial<Livro>) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID do livro inválido.');
        }

        if (dados.titulo !== undefined) {
            if (dados.titulo.trim() === '') {
                throw new Error('O título do livro não pode ficar vazio.');
            }

            dados.titulo = dados.titulo.trim();
        }

        if (dados.id_autor !== undefined) {
            if (!Number.isInteger(dados.id_autor) || dados.id_autor <= 0) {
                throw new Error('O ID do autor deve ser um número inteiro positivo.');
            }
        }

        if (dados.quantidade_disponivel !== undefined) {
            if (dados.quantidade_disponivel < 0) {
                throw new Error('A quantidade disponível não pode ser negativa.');
            }
        }

        return this.repository.atualizarLivro(id, dados);
    }

    async excluirLivro(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID do livro inválido.');
        }

        return this.repository.excluirLivro(id);
    }
}
