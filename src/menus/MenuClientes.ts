import { LeitorPrompt } from '../utils/leitorPrompt';
import { ValidadorEntrada } from '../utils/validadorEntrada';
import { ClienteController } from '../controllers/ClienteController';

export class MenuClientes {
    private prompt: LeitorPrompt;
    private clienteController: ClienteController;

    constructor(prompt: LeitorPrompt, clienteController: ClienteController) {
        this.prompt = prompt;
        this.clienteController = clienteController;
    }

    private mostrarSubmenu(titulo: string, opcoes: string[]): void {
        console.log(`\n===== ${titulo} =====`);
        opcoes.forEach((opcao, index) => console.log(`${index + 1}. ${opcao}`));
        console.log('0. Voltar ao menu principal');
        console.log('====================');
    }

    private async aguardarRetorno(): Promise<void> {
        await this.prompt.perguntar('Pressione Enter para voltar ao menu principal...');
    }

    private async cadastrarCliente(): Promise<void> {
        console.log('\n--- Cadastro de Cliente ---');
        const nome = await this.prompt.perguntar('Nome: ');
        const email = await this.prompt.perguntar('Email: ');
        const telefone = await this.prompt.perguntar('Telefone (deixe vazio para omitir): ');

        try {
            const dados: { nome: string; email: string; telefone?: string | null } = {
                nome,
                email
            };

            if (telefone) {
                dados.telefone = telefone;
            }

            const cliente = await this.clienteController.criarCliente(dados);
            console.log('\x1b[32m%s\x1b[0m', `\nCliente cadastrado com sucesso! ID: ${cliente.id_cliente}`);
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async listarClientes(): Promise<void> {
        console.log('\n--- Lista de Clientes ---');
        try {
            const clientes = await this.clienteController.listarClientes();

            if (clientes.length === 0) {
                console.log('Nenhum cliente cadastrado.');
                return;
            }

            clientes.forEach(cliente => {
                console.log(`ID: ${cliente.id_cliente} | Nome: ${cliente.nome} | Email: ${cliente.email} | Telefone: ${cliente.telefone || 'Não informado'} | Ativo: ${cliente.ativo ? 'Sim' : 'Não'}`);
            });
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async buscarClientePorId(): Promise<void> {
        console.log('\n--- Buscar Cliente por ID ---');
        const idStr = await this.prompt.perguntar('Digite o ID do cliente: ');
        const id = parseInt(idStr, 10);

        if (isNaN(id) || id <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID inválido.');
            return;
        }

        try {
            const cliente = await this.clienteController.buscarClientePorId(id);

            if (!cliente) {
                console.log('\x1b[33m%s\x1b[0m', 'Cliente não encontrado.');
                return;
            }

            console.log(`ID: ${cliente.id_cliente} | Nome: ${cliente.nome} | Email: ${cliente.email} | Telefone: ${cliente.telefone || 'Não informado'} | Ativo: ${cliente.ativo ? 'Sim' : 'Não'}`);
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async atualizarCliente(): Promise<void> {
        console.log('\n--- Atualizar Cliente ---');
        const idStr = await this.prompt.perguntar('Digite o ID do cliente a atualizar: ');
        const id = parseInt(idStr, 10);

        if (isNaN(id) || id <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID inválido.');
            return;
        }

        try {
            const cliente = await this.clienteController.buscarClientePorId(id);

            if (!cliente) {
                console.log('\x1b[33m%s\x1b[0m', 'Cliente não encontrado.');
                return;
            }

            console.log(`Cliente encontrado: ${cliente.nome}`);
            console.log('Digite o novo valor ou pressione Enter para manter o atual:');

            const nome = await this.prompt.perguntar(`Nome (${cliente.nome}): `);
            const email = await this.prompt.perguntar(`Email (${cliente.email}): `);
            const telefone = await this.prompt.perguntar(`Telefone (${cliente.telefone || 'Não informado'}): `);

            const dados: { nome?: string; email?: string; telefone?: string | null } = {};

            if (nome) {
                dados.nome = nome;
            }

            if (email) {
                dados.email = email;
            }

            if (telefone) {
                dados.telefone = telefone;
            }

            if (Object.keys(dados).length === 0) {
                console.log('Nenhuma alteração realizada.');
                return;
            }

            const clienteAtualizado = await this.clienteController.atualizarCliente(id, dados);

            if (clienteAtualizado) {
                console.log('\x1b[32m%s\x1b[0m', '\nCliente atualizado com sucesso!');
            } else {
                console.log('\x1b[33m%s\x1b[0m', 'Nenhuma alteração foi aplicada.');
            }
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async excluirCliente(): Promise<void> {
        console.log('\n--- Excluir Cliente ---');
        const idStr = await this.prompt.perguntar('Digite o ID do cliente a excluir: ');
        const id = parseInt(idStr, 10);

        if (isNaN(id) || id <= 0) {
            console.log('\x1b[31m%s\x1b[0m', 'ID inválido.');
            return;
        }

        try {
            const cliente = await this.clienteController.buscarClientePorId(id);

            if (!cliente) {
                console.log('\x1b[33m%s\x1b[0m', 'Cliente não encontrado.');
                return;
            }

            console.log(`Cliente encontrado: ${cliente.nome}`);
            const confirmacao = await this.prompt.perguntar('Tem certeza que deseja excluir? (s/n): ');

            if (confirmacao.toLowerCase() !== 's') {
                console.log('Exclusão cancelada.');
                return;
            }

            const excluido = await this.clienteController.excluirCliente(id);

            if (excluido) {
                console.log('\x1b[32m%s\x1b[0m', '\nCliente excluído com sucesso!');
            } else {
                console.log('\x1b[31m%s\x1b[0m', '\nNão foi possível excluir o cliente.');
            }
        } catch (erro) {
            console.error('\x1b[31m%s\x1b[0m', `\nErro: ${(erro as Error).message}`);
        }
    }

    private async processarSubmenu(opcao: number): Promise<void> {
        switch (opcao) {
            case 1:
                await this.listarClientes();
                break;
            case 2:
                await this.buscarClientePorId();
                break;
            case 3:
                await this.cadastrarCliente();
                break;
            case 4:
                await this.atualizarCliente();
                break;
            case 5:
                await this.excluirCliente();
                break;
        }
    }

    public async iniciar(): Promise<void> {
        let executando = true;

        while (executando) {
            console.clear();
            this.mostrarSubmenu('Menu de Clientes', ['Listar clientes', 'Buscar cliente por ID', 'Cadastrar cliente', 'Editar cliente', 'Excluir cliente']);
            const entrada = await this.prompt.perguntar('Escolha uma opção: ');
            const opcao = ValidadorEntrada.validarOpcaoMenu(entrada, 0, 5);

            if (opcao === null) {
                console.clear();
                console.log('\x1b[31m%s\x1b[0m', `Opção inválida: "${entrada || 'vazia'}". Digite um número de 0 a 5.`);
                await this.aguardarRetorno();
                continue;
            }

            if (opcao === 0) {
                executando = false;
                continue;
            }

            await this.processarSubmenu(opcao);
            await this.aguardarRetorno();
        }
    }
}
