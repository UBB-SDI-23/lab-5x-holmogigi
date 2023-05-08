import { UserProfile } from "./UserProfile";

export interface User
{
    id?: number;
    name: string;
    password: string;

    accessLevel?: number;
    userProfile?: UserProfile;

    bodybuildersCount?: number;
    coachesCount?: number;
    gymsCount?: number;
    contestsCount?: number;
}