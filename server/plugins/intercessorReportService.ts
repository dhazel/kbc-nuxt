import { SppInformedReportService } from '../services/IntercessorReport/SppInformedReportService';
import { MondayAdapter } from '../adapters/MondayAdapter';
import { MondayService } from '../services/Monday/MondayService';
import { CachedMondayService } from '../services/Monday/CachedMondayService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        const mondayService = new CachedMondayService(
            new MondayService(new MondayAdapter())
        );
        event.context.intercessorReportService = new SppInformedReportService(mondayService);
    });
});
