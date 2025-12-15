import { MonthToMonthInformedReportService } from '../services/IntercessorReport/MonthToMonthInformedReportService';
import { MondayAdapter } from '../adapters/MondayAdapter';
import { MondayService } from '../services/Monday/MondayService';
import { CachedMondayService } from '../services/Monday/CachedMondayService';
import { AggregateIntercessorReportService } from '../services/IntercessorReport/AggregateIntercessorReportService';
import { MonthToMonthInspiredReportService } from '../services/IntercessorReport/MonthToMonthInspiredReportService';
import { MondayBackoffAdapter } from '../adapters/MondayBackoffAdapter';
import { AnnualInformedReportService } from '../services/IntercessorReport/AnnualInformedReportService';
import { AnnualInspiredReportService } from '../services/IntercessorReport/AnnualInspiredReportService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        const mondayService = new CachedMondayService(
            new MondayService(new MondayBackoffAdapter(new MondayAdapter()))
        );
        event.context.intercessorReportService = new AggregateIntercessorReportService([
            new MonthToMonthInformedReportService(mondayService),
            new MonthToMonthInspiredReportService(mondayService),
            new AnnualInformedReportService(mondayService),
            new AnnualInspiredReportService(mondayService),
        ]);
    });
});
