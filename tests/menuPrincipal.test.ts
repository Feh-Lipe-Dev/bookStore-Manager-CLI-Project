import test from 'node:test';
import assert from 'node:assert/strict';
import { MenuPrincipal } from '../src/menus/menuPrincipal';
import { LeitorPrompt } from '../src/utils/leitorPrompt';

test('entra no submenu de autores ao escolher a opção 1', async () => {
    const linhas: string[] = [];
    const logOriginal = console.log;
    const clearOriginal = console.clear;
    const respostas = ['1', '', '0'];
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

        const menu = new MenuPrincipal(promptFalso);
        const encerrou = await menu.iniciar();

        assert.equal(encerrou, true);
        assert.ok(linhas.some((linha) => linha.includes('Menu de Autores')));
    } finally {
        console.log = logOriginal;
        console.clear = clearOriginal;
    }
});

test('retorna verdadeiro quando o usuário escolhe a opção 0', async () => {
    const promptFalso = {
        perguntar: async () => '0',
    } as unknown as LeitorPrompt;

    const menu = new MenuPrincipal(promptFalso);
    const encerrou = await menu.iniciar();

    assert.equal(encerrou, true);
});
