export default abstract class Message<T> {
  abstract execute(message: T): Promise<any>;
}
