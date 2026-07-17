import { EmprestimoService } from '../services/EmprestimoService';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroRepository } from '../repositories/LivroRepository';
import { ClienteRepository } from '../repositories/ClienteRepository';

export class EmprestimoController {
    private service: EmprestimoService;

    constructor() {
        const emprestimoRepository = new EmprestimoRepository();
        const livroRepository = new LivroRepository();
        const clienteRepository = new ClienteRepository();
        this.service = new EmprestimoService(emprestimoRepository, livroRepository, clienteRepository);
    }

    async criarEmprestimo(dados: { id_livro: number; id_cliente: number }) {
        return this.service.criarEmprestimo(dados);
    }

    async registrarDevolucao(id: number) {
        return this.service.registrarDevolucao(id);
    }

    async listarEmprestimos() {
        return this.service.listarEmprestimos();
    }

    async buscarEmprestimoPorId(id: number) {
        return this.service.buscarEmprestimoPorId(id);
    }

    async excluirEmprestimo(id: number) {
        return this.service.excluirEmprestimo(id);
    }
}
