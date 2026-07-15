export interface Autores {
    id_autor: number;
    nome: string;
    nacionalidade?: string | null;
    data_nascimento?: Date | null;
    ativo: boolean;
    criado_em: Date;
    atualizado_em: Date;
}