import UserProfile from "~/utils/UserProfile";

export interface IPermissionProvider {
    GetForUser(user: UserProfile): string[];
}
