import { AutorService } from '../services/AutorService';
import { AutorRepository } from '../repositories/AutorRepository';

export class AutorController {
    private service: AutorService;

    constructor() {
        const repository = new AutorRepository();
        this.service = new AutorService(repository);
    }

    async criarAutor(dados: { nome: string; nacionalidade?: string | null; data_nascimento?: string | Date | null; ativo?: boolean }) {
        return this.service.criarAutor(dados);
    }

    async listarAutores() {
        return this.service.listarAutores();
    }

    async buscarAutorPorId(id: number) {
        return this.service.buscarAutorPorId(id);
    }

    async atualizarAutor(id: number, dados: any) {
        return this.service.atualizarAutor(id, dados);
    }

    async excluirAutor(id: number) {
        return this.service.excluirAutor(id);
    }
}
