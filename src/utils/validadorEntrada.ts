/* 
    #ValidadorEntrada
    - Valida se a entrada é um número e se está dentro do intervalo permitido do menu.
    - Retorna o número se for válido, ou null se for inválido.
*/

export class ValidadorEntrada {

    public static validarOpcaoMenu(entrada: string, min: number, max: number): number | null {
        const analisado = parseInt(entrada, 10);

        // Verifica se não é um número, se possui casas decimais ou se está fora do intervalo
        if (isNaN(analisado) || analisado.toString() !== entrada || analisado < min || analisado > max) {
            return null;
        }

        return analisado;
    }
}