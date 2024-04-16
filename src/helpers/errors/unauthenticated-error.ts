export default class UnauthenticatedError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}
