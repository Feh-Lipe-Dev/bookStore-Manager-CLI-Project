/*
    #LeitorPrompt
    - responsável por ler os dados digitados e expor métodos assíncronos limpos
    - faz perguntas no terminal e retorna a resposta do usuário 
*/

import * as readline from 'readline';

export class LeitorPrompt {
    private rl: readline.Interface;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    public perguntar(pergunta: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(pergunta, (resposta) => {
                resolve(resposta.trim());
            });
        });
    }

    public fecharLeitor(): void {
        this.rl.close();
    }
}