export interface IMondayAdapter {
    query(query: string): Promise<any>;
}
