export default class ForbiddenError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}
