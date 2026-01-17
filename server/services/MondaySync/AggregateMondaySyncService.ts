import type { IMondaySyncService } from './IMondaySyncService';

export class AggregateMondaySyncService implements IMondaySyncService {
    constructor(private mondaySyncServices: IMondaySyncService[]) {}

    async sync(): Promise<void> {
        for (const service of this.mondaySyncServices) {
            await service.sync();
        }
    }
}
