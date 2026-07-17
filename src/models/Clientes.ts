export interface Clientes {
    id_cliente: number;
    nome: string;
    email: string;
    telefone?: string | null;
    ativo: boolean;
    criado_em: Date;
    atualizado_em: Date;
}