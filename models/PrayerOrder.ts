import type { OrganizationUnit } from './OrganizationUnit';
import type { TestimonyType } from './TestimonyType';

export interface PrayerOrder {
    title: string;
    body: string;
    organizationUnit?: OrganizationUnit;
    testimonyTypes: TestimonyType[];
}
