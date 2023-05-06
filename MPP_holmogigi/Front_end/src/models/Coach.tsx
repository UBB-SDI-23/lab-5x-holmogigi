import { Contest } from "./Contest";
import { Gym } from "./Gym"

export interface Coach
{
    id?: number;
    name: string;
    age: number;
    rate: number;
    gymId: number;

    gym?: Gym;

    contest?: Contest[];

    [key: string]: any;
}