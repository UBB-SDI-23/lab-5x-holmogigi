import { User } from "./User";

export interface UserProfile {
    userId?: number;
    user?: User;

    bio: string;
    location: string;

    birthday?: string;
    gender?: string;
    maritalStatus?: string;

    pagePreference?: number;
}