export class User {
  constructor(
    public id: string,
    public email: string,
    public token: string,
    public tokenExpDate: Date
  ) {}

  get authToken() {
    if (!this.tokenExpDate || this.tokenExpDate <= new Date()) {
      return null;
    }
    return this.token;
  }

  get tokenTimeout() {
    if (!this.token) {
      return 0;
    }
    const timeout = this.tokenExpDate.getTime() - new Date().getTime();
    return timeout;
  }
}
