export class SppConnection {
    constructor(private monday: ReturnType<typeof mondaySdk>) {}

    async getUsers() {
        const response = await this.monday.api('query { users { name email } }');
        return response.data.users; // Adjust based on actual response structure
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
            const response = await this.monday.api(query);
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
