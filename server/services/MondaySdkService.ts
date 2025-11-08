import mondaySdk from 'monday-sdk-js';
import type { IMondayService } from './IMondayService';

export class MondayService implements IMondayService {
    private monday: any;

    constructor() {
        const config = useRuntimeConfig();
        const token = config.mondayToken;

        // const mask = s => s.length < 9 ? s : s.slice(0, 4) + '*'.repeat(s.length - 8) + s.slice(-4);
        // console.log('token:', `"${mask(config.mondayToken)}"`);

        this.monday = mondaySdk();
        this.monday.setToken(token);
    }

    async query(query: string): Promise<any> {
        try {
            const response = await this.monday.api(query);
            if (response.errors) {
                response.errors.forEach(
                    (e: any) => console.error('Monday API call error:', JSON.stringify(e))
                );
            }
            return response;
        } catch (error) {
            console.error('Monday API call failed:', error);
            throw error;
        }
    }
}
