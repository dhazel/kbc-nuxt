export class SppConnection {
  constructor(private monday: ReturnType<typeof mondaySdk>) {}

  async getUsers() {
    const response = await this.monday.api('query { users { name } }');
    return response.data.users; // Adjust based on actual response structure
  }

}
