import { RelatorioService } from '../services/RelatorioService';
import { RelatorioRepository } from '../repositories/RelatorioRepository';

export class RelatorioController {
    private service: RelatorioService;

    constructor() {
        const repository = new RelatorioRepository();
        this.service = new RelatorioService(repository);
    }

    async livrosDisponiveis() {
        return this.service.livrosDisponiveis();
    }

    async livrosEmprestados() {
        return this.service.livrosEmprestados();
    }

    async livrosCadastradosPorAutor() {
        return this.service.livrosCadastradosPorAutor();
    }

    async emprestimosPorLivro() {
        return this.service.emprestimosPorLivro();
    }

    async clientesComEmprestimosAtivos() {
        return this.service.clientesComEmprestimosAtivos();
    }

    async emprestimosPorPeriodo() {
        return this.service.emprestimosPorPeriodo();
    }

    async rankingClientes() {
        return this.service.rankingClientes();
    }
}
