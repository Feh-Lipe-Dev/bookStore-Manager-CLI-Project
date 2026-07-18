# BookStore Manager CLI

## Descrição do projeto

O **BookStore Manager CLI** é uma aplicação de linha de comando desenvolvida em Node.js + TypeScript para gerenciamento de uma livraria. O sistema permite cadastrar e gerenciar autores, livros e clientes, realizar empréstimos e devoluções de livros, além de gerar relatórios estatísticos — tudo interativamente pelo terminal, com persistência de dados em banco de dados PostgreSQL.

## Objetivo

Desenvolver uma aplicação CLI que demonstre os conceitos de programação orientada a objetos, arquitetura em camadas, banco de dados relacional, aplicação de regras de negócio, operações CRUD, consultas com JOINs e agrupamentos e tratamento de erros — aplicados a um contexto real de gerenciamento de livraria.

## Tecnologias utilizadas

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **Node.js** | ≥ 18 | Runtime da aplicação |
| **TypeScript** | ^5.8.3 | Tipagem estática e orientação a objetos |
| **PostgreSQL** | — | Banco de dados relacional |
| **pg** | ^8.10.0 | Driver JavaScript para PostgreSQL |
| **dotenv** | ^16.6.1 | Carregamento de variáveis de ambiente |
| **ts-node** | ^10.9.2 | Execução direta de TypeScript (dev) |

## Requisitos para execução

- **Node.js** versão 18 ou superior
- **npm** (gerenciador de pacotes do Node.js)
- **PostgreSQL** instalado e em execução localmente
- **psql** ou outro cliente SQL (para criar o banco e rodar o schema)

## Configuração do banco de dados

1. Crie o banco de dados no PostgreSQL:

```sql
CREATE DATABASE bookstore_db;
```

2. Execute o script de criação das tabelas:

```bash
psql -U postgres -d bookstore_db -f src/databases/schema.sql
```

3. Crie o arquivo `.env` na raiz do projeto com base no `.env.
example`:

```dotenv
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=sua_senha
PGDATABASE=bookstore_db
```

> Substitua `sua_senha` pela senha do seu usuário do PostgreSQL.

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/projeto-bookstore.git

# Entre na pasta do projeto
cd projeto-bookstore

# Instale as dependências
npm install
```

## Execução

```bash
# Desenvolvimento (executa direto o TypeScript)
npm run dev

# Produção (compila e executa o JavaScript)
npm run build
npm start
```

## Arquitetura do projeto

A aplicação segue uma arquitetura em camadas com injeção de dependência via construtores:

```
┌─────────────────────────────────────────────────┐
│                    main.ts                      │
│              (Composition Root)                 │
│   Instancia e injeta todas as dependências      │
└──────────────────────┬──────────────────────────┘
                       │
              ┌────────▼────────┐
              │  MenuPrincipal  │  ← Roteador principal
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────────┐
        │              │                  │
  ┌─────▼─────┐ ┌─────▼─────┐    ┌──────▼───────┐
  │MenuAutores│ │MenuLivros │    │MenuRelatorios│  ← Menus (interação CLI)
  └─────┬─────┘ └─────┬─────┘    └──────┬───────┘
        │              │                  │
  ┌─────▼─────┐ ┌─────▼─────┐    ┌──────▼──────┐
  │ AutorCtrl │ │ LivroCtrl │    │RelatorioCtrl│  ← Controllers (validação)
  └─────┬─────┘ └─────┬─────┘    └──────┬──────┘
        │             │                 │
  ┌─────▼─────┐ ┌─────▼─────┐    ┌──────▼──────┐
  │  AutorSvc │ │  LivroSvc │    │RelatorioSvc │  ← Services (regras de negócio)
  └─────┬─────┘ └─────┬─────┘    └──────┬──────┘
        │             │                 │
  ┌─────▼─────┐ ┌─────▼─────┐    ┌──────▼──────┐
  │ AutorRepo │ │ ivroRepo  │    │RelatorioRepo│  ← Repositories (acesso ao BD)
  └─────┬─────┘ └─────┬─────┘    └──────┬──────┘
        │             │                 │
  ┌─────▼──────────────▼──────────────────▼──────┐
  │           PostgreSQL (connection.ts)         │  ← Database
  └──────────────────────────────────────────────┘
```

**Princípios aplicados:**

- **Separação de responsabilidades** — cada camada tem uma única responsabilidade
- **Injeção de dependência** — dependências são passadas via construtores, facilitando testes e troca de implementações
- **Composition Root** — `main.ts` é o único lugar que cria e conecta todas as instâncias
- **Interfaces compartilhadas** — models definem contratos usados em todas as camadas

## Funcionalidades implementadas

### CRUD de Autores

- Cadastrar novo autor (nome, data de nascimento, nacionalidade)
- Listar todos os autores
- Buscar autor por ID
- Atualizar dados do autor
- Excluir autor ou soft delete

### CRUD de Livros

- Cadastrar novo livro (título, autor, quantidade disponível)
- Listar todos os livros
- Buscar livro por ID
- Atualizar dados do livro
- Excluir livro ou soft delete

### CRUD de Clientes

- Cadastrar novo cliente (nome, email, telefone)
- Listar todos os clientes
- Buscar cliente por ID
- Atualizar dados do cliente
- Excluir cliente ou soft delete

### Empréstimos

- Realizar empréstimo (validação: livro existe, cliente existe, estoque disponível, estoque decrementado)
- Devolver empréstimo (validação: não está devolvido, estoque incrementado)
- Listar empréstimos com INNER JOIN (livro, cliente, datas, status)
- Buscar empréstimo por ID
- Excluir empréstimo

### Relatórios

1. **Livros disponíveis** — livros com quantidade > 0
2. **Empréstimos ativos** — empréstimos não devolvidos
3. **Livros por autor** — agrupamento com COUNT
4. **Empréstimos por livro** — estatísticas de empréstimos
5. **Clientes com empréstimos ativos** — clientes que possuem empréstimos pendentes
6. **Empréstimos por período mensal** — agrupamento por mês com TO_CHAR
7. **Ranking de clientes** — top clientes por quantidade de empréstimos

## Estrutura de pastas

```
projeto-bookstore/
├── src/
│   ├── main.ts                    # Composition Root
│   ├── databases/
│   │   ├── connection.ts          # Conexão com PostgreSQL
│   │   └── schema.sql             # DDL das tabelas
│   ├── models/
│   │   ├── Autores.ts             # Interface Autor
│   │   ├── Livros.ts              # Interface Livro
│   │   ├── Clientes.ts            # Interface Cliente
│   │   ├── Emprestimos.ts         # Interface Emprestimo
│   │   └── Relatorio.ts           # Interfaces de relatórios
│   ├── controllers/
│   │   ├── AutorController.ts
│   │   ├── LivroController.ts
│   │   ├── ClienteController.ts
│   │   ├── EmprestimoController.ts
│   │   └── RelatorioController.ts
│   ├── services/
│   │   ├── AutorService.ts
│   │   ├── LivroService.ts
│   │   ├── ClienteService.ts
│   │   ├── EmprestimoService.ts
│   │   └── RelatorioService.ts
│   ├── repositories/
│   │   ├── AutorRepository.ts
│   │   ├── LivroRepository.ts
│   │   ├── ClienteRepository.ts
│   │   ├── EmprestimoRepository.ts
│   │   └── RelatorioRepository.ts
│   ├── menus/
│   │   ├── MenuPrincipal.ts       # Roteador principal
│   │   ├── MenuAutores.ts
│   │   ├── MenuLivros.ts
│   │   ├── MenuClientes.ts
│   │   ├── MenuEmprestimos.ts
│   │   └── MenuRelatorios.ts
│   └── utils/
│       ├── leitorPrompt.ts        # Leitura de input do terminal
│       └── validadorEntrada.ts    # Validação de opções do menu
├── tests/
│   ├── menuPrincipal.test.ts
│   └── validadorEntrada.test.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Exemplos de utilização

### Menu principal
```
====================================
       BOOKSTORE MANAGER CLI        
====================================
1. Autores [Gerenciamento]
2. Livros [Gerenciamento]
3. Clientes [Gerenciamento]
4. Empréstimos [Realizar/Devolver]
5. Relatórios [Estatísticas]
0. Encerrar Aplicação
====================================
Escolha uma opção: 
```

### Cadastrando um autor
```
===== Autores =====
1. Cadastrar autor
2. Listar autores
3. Buscar autor por ID
4. Atualizar autor
5. Excluir autor
0. Voltar ao menu principal
====================
Escolha uma opção: 1

Nome: Machado de Assis
Data de nascimento (AAAA-MM-DD): 1839-06-21
Nacionalidade: Brasileiro

--> Autor cadastrado com sucesso! (ID: 1)
```

### Listando livros
```
===== Livros - Lista =====
ID | Título                          | Autor                | Qtd
 1 | Dom Casmurro                    | Machado de Assis     |   5
 2 | O Alquimista                    | Paulo Coelho         |   3
 3 | Clean Code                      | Robert C. Martin     |   7
=======================================
```

### Realizando um empréstimo
```
=== Empréstimo de Livro ===
ID do livro: 1
ID do cliente: 1

--> Empréstimo realizado com sucesso! (ID: 1)
--> Livro "Dom Casmurro" — estoque: 5 → 4
```

### Gerando um relatório
```
===== Empréstimos Ativos =====
ID | Livro                | Cliente          | Data Empréstimo | Status
 1 | Dom Casmurro         | João Silva       | 2026-07-15      | Ativo
 2 | Clean Code           | Maria Santos     | 2026-07-16      | Ativo
==============================
Total: 2 empréstimo(s) ativo(s)
```

## Integrantes da equipe

- **Felipe Goncalves** — Desenvolvimento completo
- **Contato:** [Linkedin](https://www.linkedin.com/in/feh-lipe-dev/)

## Link do Kanban

- [Backlog Kanban](https://docs.google.com/spreadsheets/d/1eyhQg5D09Dkh9YOYOm4XztkUEm7CALF1QYjHYbKKFRw/edit?usp=sharing)
