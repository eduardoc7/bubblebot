export default class HelperStr {
  static formatMessageToCheck(message_body: string): string {
    const msg_body_without_acentos = message_body
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/,/g, '')
      .toLowerCase();

    return msg_body_without_acentos;
  }
}
