import { SppInformedReportService } from '../services/IntercessorReport/SppInformedReportService';
import { MondayService } from '../services/MondayService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        const mondayService = new MondayService();
        event.context.intercessorReportService = new SppInformedReportService(mondayService);
    });
});
