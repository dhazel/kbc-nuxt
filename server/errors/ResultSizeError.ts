export class ResultSizeError extends Error {
    public readonly maxSize: number;
    public readonly actualSize: number;

    constructor(message: string, maxSize: number, actualSize: number) {
        super(message);
        this.name = 'ResultSizeError';
        this.maxSize = maxSize;
        this.actualSize = actualSize;

        // Maintains proper stack trace for where error was thrown (Node.js only)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ResultSizeError);
        }
    }

    static exceedsMaxSize(
        actualSize: number,
        maxSize: number
    ): ResultSizeError {
        return new ResultSizeError(
            `Result size ${actualSize} exceeds maximum allowed size of ${maxSize}`,
            maxSize,
            actualSize
        );
    }
}
