export class UserCredentialsInvalid extends Error {
  constructor() {
    super('E-mail and/or password invalid')
  }
}
