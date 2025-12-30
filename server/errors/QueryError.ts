export class QueryError extends Error {
    public readonly errors: any[];

    constructor(message: string, errors: any[]) {
        super(message);
        this.name = 'QueryError';
        this.errors = errors;

        // Maintains proper stack trace for where error was thrown (Node.js only)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, QueryError);
        }
    }

    static fromGraphQLErrors(errors: any[]): QueryError {
        return new QueryError(
            'Errors occurred while querying Monday.com API',
            errors
        );
    }
}
