export interface Livro {
    id_livro: number;
    titulo: string;
    id_autor: number;
    quantidade_disponivel: number;
    ativo: boolean;
    criado_em: Date;
    atualizado_em: Date;
}
