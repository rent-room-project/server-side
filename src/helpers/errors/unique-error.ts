export default class UniqueError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}
