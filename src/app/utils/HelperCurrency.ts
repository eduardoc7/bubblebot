export default class HelperCurrency {
  static priceToString(price: number): string {
    console.log('VALOR PRECO> ', price);
    const amount_1000 = price / 1000;
    console.log(amount_1000);
    return amount_1000.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
