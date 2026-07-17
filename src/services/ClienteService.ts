import { ClienteRepository } from '../repositories/ClienteRepository';
import { Clientes } from '../models/Clientes';

export class ClienteService {
    private repository: ClienteRepository;

    constructor(repository: ClienteRepository) {
        this.repository = repository;
    }

    async criarCliente(dados: { nome: string; email: string; telefone?: string | null; ativo?: boolean }) {
        if (!dados.nome || dados.nome.trim() === '') {
            throw new Error('O nome do cliente é obrigatório.');
        }

        const nome = dados.nome.trim();

        if (nome.length < 2) {
            throw new Error('O nome do cliente deve ter pelo menos 2 caracteres.');
        }

        if (!dados.email || dados.email.trim() === '') {
            throw new Error('O email do cliente é obrigatório.');
        }

        const email = dados.email.trim();

        if (!email.includes('@') || !email.includes('.')) {
            throw new Error('O email informado não é válido.');
        }

        return this.repository.criarCliente({
            nome,
            email,
            telefone: dados.telefone ?? null,
            ativo: dados.ativo ?? true
        });
    }

    async listarClientes() {
        return this.repository.listarClientes();
    }

    async buscarClientePorId(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID do cliente inválido.');
        }

        return this.repository.buscarClientePorId(id);
    }

    async atualizarCliente(id: number, dados: Partial<Clientes>) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID do cliente inválido.');
        }

        if (dados.nome !== undefined) {
            if (dados.nome.trim() === '') {
                throw new Error('O nome do cliente não pode ficar vazio.');
            }

            dados.nome = dados.nome.trim();
        }

        if (dados.email !== undefined) {
            if (dados.email.trim() === '') {
                throw new Error('O email do cliente não pode ficar vazio.');
            }

            const email = dados.email.trim();

            if (!email.includes('@') || !email.includes('.')) {
                throw new Error('O email informado não é válido.');
            }

            dados.email = email;
        }

        return this.repository.atualizarCliente(id, dados);
    }

    async excluirCliente(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID do cliente inválido.');
        }

        return this.repository.excluirCliente(id);
    }
}
