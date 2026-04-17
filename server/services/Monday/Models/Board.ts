import { Column } from "./Column";

export interface Board {
    mondayId: number;
    name: string;
    columns: Column[];
}
