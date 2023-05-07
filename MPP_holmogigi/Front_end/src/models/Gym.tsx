import { Coach } from "./Coach";

export interface Gym
{
    id?: number;
    name: string;
    location: string;
    memembership: number;
    grade: number;

    coaches?: Coach[]; 
    userid: number;
    [key: string]: any;
}