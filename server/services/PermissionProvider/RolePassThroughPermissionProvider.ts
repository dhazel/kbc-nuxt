import UserProfile from "~/utils/UserProfile";
import { IPermissionProvider } from "./IPermissionProvider";

export class RolePassThroughPermissionProvider implements IPermissionProvider {
    constructor() {}

    GetForUser(user: UserProfile): string[] {
        return [... user.roles];
    }
}
