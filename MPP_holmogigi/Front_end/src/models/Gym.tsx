import { Coach } from "./Coach";
import { User } from "./User";

export interface Gym
{
    id?: number;
    name: string;
    location: string;
    memembership: number;
    grade: number;

    coaches?: Coach[]; 
    userid?: number;
    user?: User;
    [key: string]: any;
}