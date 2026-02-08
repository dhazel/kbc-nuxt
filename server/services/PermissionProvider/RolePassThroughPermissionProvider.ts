import type UserProfile from "~/utils/UserProfile";
import type { IPermissionProvider } from "./IPermissionProvider";

export class RolePassThroughPermissionProvider implements IPermissionProvider {
    constructor() {}

    GetForUser(user: UserProfile): string[] {
        return [... user.roles];
    }
}
