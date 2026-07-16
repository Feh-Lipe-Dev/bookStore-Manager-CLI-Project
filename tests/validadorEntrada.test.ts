import test from 'node:test';
import assert from 'node:assert/strict';
import { ValidadorEntrada } from '../src/utils/validadorEntrada';

test('aceita opções válidas de menu', () => {
    assert.equal(ValidadorEntrada.validarOpcaoMenu('0', 0, 5), 0);
    assert.equal(ValidadorEntrada.validarOpcaoMenu('5', 0, 5), 5);
});

test('rejeita entradas inválidas', () => {
    assert.equal(ValidadorEntrada.validarOpcaoMenu('6', 0, 5), null);
    assert.equal(ValidadorEntrada.validarOpcaoMenu('1.5', 0, 5), null);
    assert.equal(ValidadorEntrada.validarOpcaoMenu('abc', 0, 5), null);
});
