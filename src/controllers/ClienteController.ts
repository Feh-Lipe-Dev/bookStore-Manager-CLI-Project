import { ClienteService } from '../services/ClienteService';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { Clientes } from '../models/Clientes';

export class ClienteController {
    private service: ClienteService;

    constructor() {
        const repository = new ClienteRepository();
        this.service = new ClienteService(repository);
    }

    async criarCliente(dados: { nome: string; email: string; telefone?: string | null; ativo?: boolean }) {
        return this.service.criarCliente(dados);
    }

    async listarClientes() {
        return this.service.listarClientes();
    }

    async buscarClientePorId(id: number) {
        return this.service.buscarClientePorId(id);
    }

    async atualizarCliente(id: number, dados: Partial<Clientes>) {
        return this.service.atualizarCliente(id, dados);
    }

    async excluirCliente(id: number) {
        return this.service.excluirCliente(id);
    }
}
