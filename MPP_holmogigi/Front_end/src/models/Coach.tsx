import { Contest } from "./Contest";
import { Gym } from "./Gym"
import { User } from "./User";

export interface Coach
{
    id?: number;
    name: string;
    age: number;
    rate: number;
    gymId: number;

    gym?: Gym;

    contest?: Contest[];
    userid?: number;
    user?: User
    [key: string]: any;
}