
export interface ItemUpdate {
    id: string;
    body: string;
    bodyText: string;
    created_at: string;
    edited_at: string;
    creator: User;
    item: Item;
    viewers: ViewRecord[];
    reactions: ReactionRecord[];
    replies: ItemUpdate[];
}
