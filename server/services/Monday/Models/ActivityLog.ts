
export interface ActivityLog {
    id: string;
    event: string;
    data: string;
    user_id: string;
    created_at: string;
    boardName?: string;
    boardId?: number;
}
