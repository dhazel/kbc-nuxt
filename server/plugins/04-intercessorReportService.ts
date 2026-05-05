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
        const boardIdProvider = event.context.boardIdProvider;
        event.context.intercessorReportService =
            new AggregateIntercessorReportService([
                new MonthToMonthInformedReportService(mondayService, boardIdProvider),
                new MonthToMonthInspiredReportService(mondayService, boardIdProvider),
                new AnnualInformedReportService(mondayService, boardIdProvider),
                new AnnualInspiredReportService(mondayService, boardIdProvider),
            ]);
    });
});
