import type { IMondayAdapter } from './IMondayAdapter';

interface BackoffOptions {
    maxRetries?: number;
    baseDelayMs?: number;
    retryableStatuses?: number[];
    jitterFactor?: number;
}

export class MondayBackoffAdapter implements IMondayAdapter {
    private mondayAdapter: IMondayAdapter;
    private options: Required<BackoffOptions>;

    constructor(mondayAdapter: IMondayAdapter, options: BackoffOptions = {}) {
        this.mondayAdapter = mondayAdapter;
        this.options = {
            maxRetries: options.maxRetries ?? 3,
            baseDelayMs: options.baseDelayMs ?? 1000,
            retryableStatuses: options.retryableStatuses ?? [
                429, 500, 502, 503, 504,
            ],
            jitterFactor: options.jitterFactor ?? 0.2,
        };
    }

    async query(query: string): Promise<any> {
        for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
            try {
                const result = await this.mondayAdapter.query(query);
                // Check if the result contains errors that should be retried
                if (result.errors) {
                    const shouldRetry = result.errors.some(
                        (error: { status: number }) =>
                            this.options.retryableStatuses.includes(
                                error.status
                            )
                    );
                    if (!shouldRetry || attempt === this.options.maxRetries) {
                        return result;
                    }
                } else {
                    return result;
                }
            } catch (error: unknown) {
                // Retry on network errors
                if (attempt === this.options.maxRetries) {
                    throw error;
                }
            }
            // Exponential backoff delay with jitter
            if (attempt < this.options.maxRetries) {
                const delay =
                    this.options.baseDelayMs *
                    Math.pow(2, attempt) *
                    (1 + Math.random() * this.options.jitterFactor);
                console.info(`Monday query retrying; Attempt: ${attempt + 1}; Delay: ${Math.floor(delay)} (ms)`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }
}
