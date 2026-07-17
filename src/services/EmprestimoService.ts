import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroRepository } from '../repositories/LivroRepository';
import { ClienteRepository } from '../repositories/ClienteRepository';

export class EmprestimoService {
    private emprestimoRepository: EmprestimoRepository;
    private livroRepository: LivroRepository;
    private clienteRepository: ClienteRepository;

    constructor(
        emprestimoRepository: EmprestimoRepository,
        livroRepository: LivroRepository,
        clienteRepository: ClienteRepository
    ) {
        this.emprestimoRepository = emprestimoRepository;
        this.livroRepository = livroRepository;
        this.clienteRepository = clienteRepository;
    }

    async criarEmprestimo(dados: { id_livro: number; id_cliente: number }) {
        if (!Number.isInteger(dados.id_livro) || dados.id_livro <= 0) {
            throw new Error('O ID do livro é obrigatório e deve ser um número inteiro positivo.');
        }

        if (!Number.isInteger(dados.id_cliente) || dados.id_cliente <= 0) {
            throw new Error('O ID do cliente é obrigatório e deve ser um número inteiro positivo.');
        }

        const livro = await this.livroRepository.buscarLivroPorId(dados.id_livro);
        if (!livro) {
            throw new Error('Livro não encontrado.');
        }

        if (!livro.ativo) {
            throw new Error('O livro informado está inativo.');
        }

        const cliente = await this.clienteRepository.buscarClientePorId(dados.id_cliente);
        if (!cliente) {
            throw new Error('Cliente não encontrado.');
        }

        if (!cliente.ativo) {
            throw new Error('O cliente informado está inativo.');
        }

        if (livro.quantidade_disponivel <= 0) {
            throw new Error('O livro não possui exemplares disponíveis para empréstimo.');
        }

        const emprestimo = await this.emprestimoRepository.criarEmprestimo({
            id_livro: dados.id_livro,
            id_cliente: dados.id_cliente,
            data_emprestimo: new Date()
        });

        await this.livroRepository.atualizarLivro(dados.id_livro, {
            quantidade_disponivel: livro.quantidade_disponivel - 1
        });

        return emprestimo;
    }

    async registrarDevolucao(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID do empréstimo inválido.');
        }

        const emprestimo = await this.emprestimoRepository.buscarEmprestimoPorId(id);
        if (!emprestimo) {
            throw new Error('Empréstimo não encontrado.');
        }

        if (emprestimo.data_devolucao) {
            throw new Error('Este empréstimo já foi devolvido.');
        }

        const devolvido = await this.emprestimoRepository.registrarDevolucao(id);

        if (devolvido) {
            const livro = await this.livroRepository.buscarLivroPorId(emprestimo.id_livro);
            if (livro) {
                await this.livroRepository.atualizarLivro(emprestimo.id_livro, {
                    quantidade_disponivel: livro.quantidade_disponivel + 1
                });
            }
        }

        return devolvido;
    }

    async listarEmprestimos() {
        return this.emprestimoRepository.listarEmprestimos();
    }

    async buscarEmprestimoPorId(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID do empréstimo inválido.');
        }

        return this.emprestimoRepository.buscarEmprestimoPorId(id);
    }

    async excluirEmprestimo(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID do empréstimo inválido.');
        }

        return this.emprestimoRepository.excluirEmprestimo(id);
    }
}
