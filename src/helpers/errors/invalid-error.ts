export default class InvalidError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}
