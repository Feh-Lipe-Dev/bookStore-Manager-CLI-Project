import { RelatorioRepository } from '../repositories/RelatorioRepository';

export class RelatorioService {
    private repository: RelatorioRepository;

    constructor(repository: RelatorioRepository) {
        this.repository = repository;
    }

    async livrosDisponiveis() {
        return this.repository.livrosDisponiveis();
    }

    async livrosEmprestados() {
        return this.repository.livrosEmprestados();
    }

    async livrosCadastradosPorAutor() {
        return this.repository.livrosCadastradosPorAutor();
    }

    async emprestimosPorLivro() {
        return this.repository.emprestimosPorLivro();
    }

    async clientesComEmprestimosAtivos() {
        return this.repository.clientesComEmprestimosAtivos();
    }

    async emprestimosPorPeriodo() {
        return this.repository.emprestimosPorPeriodo();
    }

    async rankingClientes() {
        return this.repository.rankingClientes();
    }
}
