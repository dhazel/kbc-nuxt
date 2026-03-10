import type { OrganizationUnit } from './OrganizationUnit';

export interface PrayerOrder {
    title: string;
    body: string;
    organizationUnit?: OrganizationUnit;
}
