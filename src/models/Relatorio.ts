export interface LivroDisponivel {
    id_livro: number;
    titulo: string;
    nome_autor: string;
    quantidade_disponivel: number;
}

export interface LivroEmprestado {
    id_emprestimo: number;
    titulo: string;
    nome_cliente: string;
    data_emprestimo: Date;
}

export interface LivrosPorAutor {
    nome_autor: string;
    total_livros: number;
}

export interface EmprestimosPorLivro {
    titulo: string;
    nome_autor: string;
    total_emprestimos: number;
}

export interface ClienteComEmprestimoAtivo {
    nome_cliente: string;
    email: string;
    emprestimos_ativos: number;
}

export interface EmprestimosPorPeriodo {
    periodo: string;
    total_emprestimos: number;
}

export interface RankingCliente {
    nome_cliente: string;
    email: string;
    total_emprestimos: number;
}
