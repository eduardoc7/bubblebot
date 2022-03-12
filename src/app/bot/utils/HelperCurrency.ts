export default class HelperCurrency {
  static priceToString(price: number): string {
    const amount_1000 = price / 1000;
    return amount_1000.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
