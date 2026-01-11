export interface SubscriptionDTO {
    id: number;
    name: string;
    description?: string | null;
    createdAt: Date;
}

export interface ThreadTypeDTO {
    id: number;
    name: string;
    description?: string | null;
}

export interface MondayBoardDTO {
    id: number;
    mondayBoardId: string;
    boardName?: string | null;
    organizationId?: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface BoardMappingDTO {
    id: number;
    subscriptionId: number;
    subscription: SubscriptionDTO;
    threadTypeId: number;
    threadType: ThreadTypeDTO;
    mondayBoardId?: number | null;
    mondayBoard?: MondayBoardDTO | null;
}
