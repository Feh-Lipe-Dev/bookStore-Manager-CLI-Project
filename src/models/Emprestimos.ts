export interface Emprestimos {
    id_emprestimo: number;
    id_livro: number;
    id_cliente: number;
    data_emprestimo: Date;
    data_devolucao: Date | null;
    criado_em: Date;
    atualizado_em: Date;
}