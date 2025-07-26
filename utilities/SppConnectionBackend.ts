export class SppConnectionBackend {
    constructor(private monday: ReturnType<typeof mondaySdk>) {}

    async getUsers() {
        const response = await this.monday.api('query { users { name email } }');
        return response.data.users; // Adjust based on actual response structure
    }

    async addPrayerOrderForInformedIntercession(user: User, prayerOrder: PrayerOrder) {
        const board = await this.getBoard("Informed Intercession");
        let informedIntercessionGroup = await this.getInformedIntercessionGroup(user);
        if (informedIntercessionGroup === null) {
            informedIntercessionGroup = await this.addInformedIntercessionGroup(user);
        }

        await this.addItem(board.id, informedIntercessionGroup, prayerOrder.title, prayerOrder.body);
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
        const itemResponse = await this.monday.api(createItemMutation);
        const itemId = parseInt(itemResponse.data.create_item.id, 10);

        // Step 2: Add the update with the body
        const createUpdateMutation = `
          mutation {
            create_update (item_id: ${itemId}, body: "${body}") {
              id
            }
          }
        `;
        await this.monday.api(createUpdateMutation); // We don't need the update ID, but can return it if useful

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
            const response = await this.monday.api(mutation);
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
        const response = await this.monday.api(query);
        const groups = response.data.boards[0]?.groups || [];
        const matchingGroup = groups.find((group: any) => group.title === name);
        return matchingGroup ? matchingGroup.id : null;
      } catch (error) {
        console.error(`Error fetching group '${name}' on board ${boardId}:`, error);
        throw error;
      }
    }

    private async getBoard(name: string) {
        try {
            const query = `
                query {
                  boards (state: active) {
                    id
                    name
                  }
                }
            `;
            console.log(`query: ${query}`);
            const response = await this.monday.api(query); //I have a case where this call works fine on SSR, but once the client is hydrated this call starts failing. Perhaps I need to run the app exclusively in SSR, or maybe move all the calls in this file to run on the server? Does this sound plausible? What are my options? AI?
            console.log(response);
            if (response.errors) {
                console.error(response.errors);
                throw new Error(`Errors parsing the graphql query`);
            }
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
}

interface PrayerOrder {
  title: string;
  body: string;
}

interface User {
    name: string;
    email: string;
}
