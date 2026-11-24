
export class AccountStorage {
  private static getKey(tipo: string, codigoCliente: number): string {
    return `gaminghub:${tipo}:${codigoCliente}`;
  }

  static read<T>(
    tipo: string,
    codigoCliente: number,
    valorPadrao: T,
  ): T {
    if (typeof localStorage === 'undefined') {
      return valorPadrao;
    }

    try {
      const dados = localStorage.getItem(
        this.getKey(tipo, codigoCliente),
      );

      return dados ? (JSON.parse(dados) as T) : valorPadrao;
    } catch {
      return valorPadrao;
    }
  }

  static write<T>(
    tipo: string,
    codigoCliente: number,
    dados: T,
  ): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(
        this.getKey(tipo, codigoCliente),
        JSON.stringify(dados),
      );
    } catch (erro) {
      console.error('Erro ao salvar dados da conta:', erro);
    }
  }
}
