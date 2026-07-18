import { AutorRepository } from '../repositories/AutorRepository';
import { Autores } from '../models/Autores';

export class AutorService {
    private repository: AutorRepository;

    constructor(repository: AutorRepository) {
        this.repository = repository;
    }

    async criarAutor(dados: { nome: string; nacionalidade?: string | null; data_nascimento?: string | Date | null; ativo?: boolean }) {
        if (!dados.nome || dados.nome.trim() === '') {
            throw new Error('O nome do autor é obrigatório.');
        }

        const nome = dados.nome.trim();

        if (nome.length < 2) {
            throw new Error('O nome do autor deve ter pelo menos 2 caracteres.');
        }

        let dataNascimento: Date | null = null;

        if (dados.data_nascimento) {
            const data = dados.data_nascimento instanceof Date
                ? dados.data_nascimento
                : new Date(dados.data_nascimento);

            if (Number.isNaN(data.getTime())) {
                throw new Error('Data de nascimento inválida.');
            }

            dataNascimento = data;
        }

        return this.repository.criarAutor({
            nome,
            nacionalidade: dados.nacionalidade?.trim() || null,
            data_nascimento: dataNascimento,
            ativo: dados.ativo ?? true
        });
    }

    async listarAutores() {
        return this.repository.listarAutores();
    }

    async buscarAutorPorId(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID do autor inválido.');
        }

        return this.repository.buscarAutorPorId(id);
    }

    async atualizarAutor(id: number, dados: Partial<Autores>) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID do autor inválido.');
        }

        if (dados.nome !== undefined) {
            if (dados.nome.trim() === '') {
                throw new Error('O nome do autor não pode ficar vazio.');
            }

            dados.nome = dados.nome.trim();
        }

        if (dados.nacionalidade !== undefined) {
            dados.nacionalidade = dados.nacionalidade?.trim() || null;
        }

        if (dados.data_nascimento !== undefined && dados.data_nascimento !== null) {
            const data = dados.data_nascimento instanceof Date
                ? dados.data_nascimento
                : new Date(dados.data_nascimento);

            if (Number.isNaN(data.getTime())) {
                throw new Error('Data de nascimento inválida.');
            }

            dados.data_nascimento = data;
        }

        return this.repository.atualizarAutor(id, dados);
    }

    async excluirAutor(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID do autor inválido.');
        }

        return this.repository.excluirAutor(id);
    }
}
