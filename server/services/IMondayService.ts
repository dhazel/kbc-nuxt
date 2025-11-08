export interface IMondayService {
    query(query: string): Promise<any>;
}