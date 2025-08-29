export class SppService {
  constructor(private headers, private storage?: any) {}

  // Method to set storage after construction (for client-side usage)
  setStorage(storage: any) {
    this.storage = storage;
  }

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

  // Storage integration methods with error handling
  async cacheUserData(userId: string, data: any) {
    if (!this.storage) {
      console.warn('Storage not available, skipping cache operation');
      return;
    }

    try {
      await this.storage.setItem(`user_${userId}`, JSON.stringify(data));
    } catch (error: any) {
      console.error('Failed to cache user data:', error.message);
      // Continue execution - don't throw error for cache failures
    }
  }

  async getCachedUserData(userId: string) {
    if (!this.storage) {
      return null;
    }

    try {
      const cached = await this.storage.getItem(`user_${userId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error: any) {
      console.error('Failed to get cached user data:', error.message);
      return null;
    }
  }

  async addPrayerOrderForInformedIntercession(user: User, prayerOrder: PrayerOrder) {
      // const board = await this.getBoard("Informed Intercession");
      // let informedIntercessionGroup = await this.getInformedIntercessionGroup(user);
      // if (informedIntercessionGroup === null) {
      //     informedIntercessionGroup = await this.addInformedIntercessionGroup(user);
      // }
      //
      // await this.addItem(board.id, informedIntercessionGroup, prayerOrder.title, prayerOrder.body);
  }

  private async addItem(boardId: number, group: { id: string }, title: string, body: string): Promise<number> {
    try {
      // Step 1: Create the item
      const createItemMutation = `
        mutation {
          create_item (board_id: ${boardId}, group_id: "${group.id}", item_name: "${title}") {
            id
          }
        }
      `;
      const itemResponse = await this.queryMonday(createItemMutation);
      const itemId = parseInt(itemResponse.data.create_item.id, 10);

      // Step 2: Add the update with the body
      const createUpdateMutation = `
        mutation {
          create_update (item_id: ${itemId}, body: "${body}") {
            id
          }
        }
      `;
      await this.queryMonday(createUpdateMutation); // We don't need the update ID, but can return it if useful

      return itemId; // Returns new item ID as number
    } catch (error) {
      console.error(`Error adding item '${title}' with update to group ${group.id} on board ${boardId}:`, error);
      throw error;
    }
  }

  async getInformedIntercessionGroup(user: User) {
      const board = await this.getBoard("Informed Intercession");
      const group = await this.getGroup(board.id, `${user.name} - ${user.email}`);
      return group;
  }

  async addInformedIntercessionGroup(user: User) {
      const board = await this.getBoard("Informed Intercession");
      const group = await this.addGroup(board.id, `${user.name} - ${user.email}`);
      return group;
  }

  private async addGroup(boardId: number, name: string) {
      try {
          const mutation = `
              mutation {
                create_group (board_id: ${boardId}, group_name: "${name}") {
                  id
                  title
                }
              }
          `;
          const response = await this.queryMonday(mutation);
          return response.data.create_group; // Returns { id, title } or adjust as needed
      } catch (error) {
          console.error(`Error creating group '${name}' on board ${boardId}:`, error);
          throw error;
      }
  }

  private async getGroup(boardId: number, name: string): Promise<string | null> {
    try {
      const query = `
        query {
          boards (ids: [${boardId}]) {
            groups {
              id
              title
            }
          }
        }
      `;
      const response = await this.queryMonday(query);
      const groups = response.data.boards[0]?.groups || [];
      const matchingGroup = groups.find((group: any) => group.title === name);
      return matchingGroup ? matchingGroup : null;
    } catch (error) {
      console.error(`Error fetching group '${name}' on board ${boardId}:`, error);
      throw error;
    }
  }

  public async getBoard(name: string) {
      try {
          const query = `
              query {
                boards (state: active) {
                  id
                  name
                }
              }
          `;
          const response = await this.queryMonday(query); 
          const boards = response.data.boards;
          const matchingBoard = boards.find((board: any) => board.name === name);
          if (!matchingBoard) {
              throw new Error(`Board with name '${name}' not found`);
          }
          return matchingBoard;
      } catch (error) {
          console.error(`Error fetching board '${name}':`, error);
          throw error;
      }
  }


  private async queryMonday(query: string) {
      try {
          const response = await $fetch(
              '/api/monday',
              {
                  method: 'POST',
                  body: { query },
                  headers: this.headers,
              }
          );
          if (response.errors) {
              throw new Error(`Errors parsing the graphql query: ${JSON.stringify(response.errors)}`);
          }
          return response;
      }
      catch (error) {
          console.log(error);
          throw new AggregateError([error], `Error querying the monday api proxy.`);
      }
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
