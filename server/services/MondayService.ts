import mondaySdk from 'monday-sdk-js';
import type { IMondayService } from './IMondayService';

export class MondayService implements IMondayService {
    private token: string;

    constructor() {
        const config = useRuntimeConfig();
        this.token = config.mondayToken;
    }

    async query(query: string): Promise<any> {
        try {
            const response = await fetch('https://api.monday.com/v2', {
                method: 'POST',
                headers: {
                    'Authorization': this.token,  // Raw personal token, no "Bearer" or other prefix
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            // // Log for debugging (visible in Netlify function logs)
            // const mask = s => s.length < 9 ? s : s.slice(0, 4) + '*'.repeat(s.length - 8) + s.slice(-4);
            // console.log('token:', `"${mask(this.token)}"`);
            // console.log('Status:', response.status);
            // console.log('Response:', JSON.stringify(data, null, 2));

            if (!response.ok) {
                console.error('Monday API call failed:', response);
                throw 'Monday API call failed';
            }

            let returnValue = {};
            if (data.data) {
                returnValue['data'] = data.data;
            }
            if (data.errors) {
                returnValue['errors'] = data.errors;
                data.errors.forEach(
                    (e: any) => console.error('Monday API call error:', JSON.stringify(e))
                );
            }
            return returnValue;
        } catch (error) {
            console.error('Fetch error:', error);
            throw 'Request failed';
        }
    }
}
