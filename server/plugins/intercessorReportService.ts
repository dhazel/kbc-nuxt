import { SppInformedReportService } from '../services/IntercessorReport/SppInformedReportService';
import { MondayAdapter } from '../adapters/MondayAdapter';
import { MondayService } from '../services/Monday/MondayService';
import { CachedMondayService } from '../services/Monday/CachedMondayService';
import { AggregateIntercessorReportService } from '../services/IntercessorReport/AggregateIntercessorReportService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        const mondayService = new CachedMondayService(
            new MondayService(new MondayAdapter())
        );
        event.context.intercessorReportService = new AggregateIntercessorReportService([
            new SppInformedReportService(mondayService)
        ]);
    });
});
