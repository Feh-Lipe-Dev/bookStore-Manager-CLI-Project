import { LivroService } from '../services/LivroService';
import { LivroRepository } from '../repositories/LivroRepository';
import { Livro } from '../models/Livros';

export class LivroController {
    private service: LivroService;

    constructor() {
        const repository = new LivroRepository();
        this.service = new LivroService(repository);
    }

    async criarLivro(dados: { titulo: string; id_autor: number; quantidade_disponivel?: number; ativo?: boolean }) {
        return this.service.criarLivro(dados);
    }

    async listarLivros() {
        return this.service.listarLivros();
    }

    async buscarLivroPorId(id: number) {
        return this.service.buscarLivroPorId(id);
    }

    async atualizarLivro(id: number, dados: Partial<Livro>) {
        return this.service.atualizarLivro(id, dados);
    }

    async excluirLivro(id: number) {
        return this.service.excluirLivro(id);
    }
}
