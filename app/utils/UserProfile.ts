
export default interface UserProfile {
    email: string;
    joinedAt: Date;
    name: string;
    visitCount: number;
    roles: string[];
    permissions: string[];
}

