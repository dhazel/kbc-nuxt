export class SppConnection {
  constructor(private headers) {}

  async getUsers() {
    const query = 'query { users { name } }';
    const { data: users } = await $fetch(
        '/api/monday',
        {
            method: 'POST',
            body: { query },
            headers: this.headers,
        }
    );

    return users;
  }

}

interface PrayerOrder {
  title: string;
  body: string;
}

interface User {
    name: string;
    email: string;
}
