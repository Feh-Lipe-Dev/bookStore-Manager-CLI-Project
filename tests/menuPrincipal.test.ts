import test from 'node:test';
import assert from 'node:assert/strict';
import { MenuPrincipal } from '../src/menus/menuPrincipal';
import { MenuAutores } from '../src/menus/menuAutores';
import { MenuLivros } from '../src/menus/menuLivros';
import { LeitorPrompt } from '../src/utils/leitorPrompt';

test('retorna verdadeiro quando o usuário escolhe a opção 0', async () => {
    const promptFalso = {
        perguntar: async () => '0',
    } as unknown as LeitorPrompt;

    const menuAutoresFalso = {} as MenuAutores;
    const menuLivrosFalso = {} as MenuLivros;

    const menu = new MenuPrincipal(promptFalso, menuAutoresFalso, menuLivrosFalso);
    const encerrou = await menu.iniciar();

    assert.equal(encerrou, true);
});

test('redireciona para menuAutores ao escolher opção 1', async () => {
    const linhas: string[] = [];
    const logOriginal = console.log;
    const clearOriginal = console.clear;
    const respostas = ['1', '0'];
    let indice = 0;

    console.log = (...args: unknown[]) => {
        linhas.push(args.join(' '));
    };
    console.clear = () => undefined;

    try {
        const promptFalso = {
            perguntar: async () => {
                const resposta = respostas[indice] ?? '';
                indice += 1;
                return resposta;
            },
        } as unknown as LeitorPrompt;

        let iniciarAutoresChamado = false;

        const menuAutoresFalso = {
            iniciar: async () => {
                iniciarAutoresChamado = true;
            },
        } as unknown as MenuAutores;

        const menuLivrosFalso = {} as MenuLivros;

        const menu = new MenuPrincipal(promptFalso, menuAutoresFalso, menuLivrosFalso);
        await menu.iniciar();

        assert.equal(iniciarAutoresChamado, true);
    } finally {
        console.log = logOriginal;
        console.clear = clearOriginal;
    }
});

test('redireciona para menuLivros ao escolher opção 2', async () => {
    const respostas = ['2', '0'];
    let indice = 0;

    const promptFalso = {
        perguntar: async () => {
            const resposta = respostas[indice] ?? '';
            indice += 1;
            return resposta;
        },
    } as unknown as LeitorPrompt;

    let iniciarLivrosChamado = false;

    const menuAutoresFalso = {} as MenuAutores;

    const menuLivrosFalso = {
        iniciar: async () => {
            iniciarLivrosChamado = true;
        },
    } as unknown as MenuLivros;

    const menu = new MenuPrincipal(promptFalso, menuAutoresFalso, menuLivrosFalso);
    await menu.iniciar();

    assert.equal(iniciarLivrosChamado, true);
});
