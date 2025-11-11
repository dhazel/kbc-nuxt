import { ReportService } from '../services/ReportService';
import { MondayService } from '../services/MondayService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        const mondayService = new MondayService();
        event.context.adminService = new ReportService(mondayService);
    });
});
