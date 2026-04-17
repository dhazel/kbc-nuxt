
export interface Item {
    id: string;
    name: string;
    created_at: Date;
    column_values: ColumnValue[];
    board?: { id: string; name: string };
    group?: { id: string; title: string };
}
