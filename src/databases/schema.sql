-- Schema para criação do Database da BookStore Manager CLI

-- TABELA AUTORES
CREATE TABLE IF NOT EXISTS autores (
    id_autor INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    data_nascimento DATE,
    nacionalidade VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- TABELA LIVROS
CREATE TABLE IF NOT EXISTS livros (
    id_livro INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    id_autor INT NOT NULL,
    quantidade_disponivel INT NOT NULL DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_autor 
        FOREIGN KEY (id_autor) 
        REFERENCES autores (id_autor) 
        ON DELETE RESTRICT
);

-- TABELA CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA EMPRÉSTIMOS
CREATE TABLE IF NOT EXISTS emprestimos (
    id_emprestimo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_livro INT NOT NULL,
    id_cliente INT NOT NULL,
    data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
    data_devolucao DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_livro 
        FOREIGN KEY (id_livro) 
        REFERENCES livros (id_livro) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_cliente 
        FOREIGN KEY (id_cliente) 
        REFERENCES clientes (id_cliente) 
        ON DELETE RESTRICT
);