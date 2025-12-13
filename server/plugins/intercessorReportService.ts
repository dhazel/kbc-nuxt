import { SppInformedReportService } from '../services/IntercessorReport/SppInformedReportService';
import { MondayAdapter } from '../adapters/MondayAdapter';
import { MondayService } from '../services/Monday/MondayService';
import { CachedMondayService } from '../services/Monday/CachedMondayService';
import { AggregateIntercessorReportService } from '../services/IntercessorReport/AggregateIntercessorReportService';
import { SppInspiredReportService } from '../services/IntercessorReport/SppInspiredReportService';
import { MondayBackoffAdapter } from '../adapters/MondayBackoffAdapter';
import { AnnualInformedReportService } from '../services/IntercessorReport/AnnualInformedReportService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        const mondayService = new CachedMondayService(
            new MondayService(new MondayBackoffAdapter(new MondayAdapter()))
        );
        event.context.intercessorReportService = new AggregateIntercessorReportService([
            new SppInformedReportService(mondayService),
            new SppInspiredReportService(mondayService),
            new AnnualInformedReportService(mondayService),
        ]);
    });
});
