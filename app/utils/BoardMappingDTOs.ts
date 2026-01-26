export interface SubscriptionDTO {
    id: number;
    name: string;
    description?: string | null;
    createdAt: Date;
}

export interface IntercessionTypeDTO {
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
    intercessionTypeId: number;
    intercessionType: IntercessionTypeDTO;
    mondayBoardId?: number | null;
    mondayBoard?: MondayBoardDTO | null;
}
