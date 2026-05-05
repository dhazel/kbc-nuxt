import { MondayAdapter } from '../adapters/MondayAdapter';
import { MondayService } from '../services/Monday/MondayService';
import { CachedMondayService } from '../services/Monday/CachedMondayService';
import { MondayBackoffAdapter } from '../adapters/MondayBackoffAdapter';
import { AggregateMondaySyncService } from '../services/MondaySync/AggregateMondaySyncService';
import { MondayUsersSyncService } from '../services/MondaySync/MondayUsersSyncService';
import { MondayBoardNameSyncService } from '../services/MondaySync/MondayBoardNameSyncService';
import { MondayPrayerOrderSyncService } from '../services/MondaySync/MondayPrayerOrderSyncService';
import { MondayMessageSyncService } from '../services/MondaySync/MondayMessageSyncService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        const mondayService = new CachedMondayService(
            new MondayService(new MondayBackoffAdapter(new MondayAdapter()))
        );
        event.context.mondaySyncService = new AggregateMondaySyncService([
            new MondayUsersSyncService(mondayService, event.context.prisma),
            new MondayBoardNameSyncService(mondayService, event.context.prisma),
            new MondayPrayerOrderSyncService(mondayService, event.context.prisma),
            new MondayMessageSyncService(
                mondayService,
                event.context.prisma,
                event.context.intercessorReportService
            ),
        ]);
    });
});
