export interface IMondaySyncService {
    /**
     * Sync data from Monday
     */
    sync(): Promise<void>;
}
