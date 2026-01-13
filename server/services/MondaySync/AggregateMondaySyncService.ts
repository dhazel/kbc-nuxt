import type { IMondaySyncService } from './IMondaySyncService';

export class AggregateMondaySyncService implements IMondaySyncService {
    constructor(private mondaySyncServices: IMondaySyncService[]) {}

    async sync(): Promise<void> {
        await Promise.all(
            this.mondaySyncServices.map(async (service) => {
                return await service.sync();
            })
        );
    }
}
