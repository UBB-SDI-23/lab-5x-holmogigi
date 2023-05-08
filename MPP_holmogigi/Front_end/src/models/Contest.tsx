import { Coach } from "./Coach";
import { Bodybuilder } from "./Bodybuilder"
import { User } from "./User";

export interface Contest
{
    datetime: string;
    name: string;
    location: string;
    coachid: number;
    bodybuilderid: number;

    coach?: Coach;
    bodybuilder?: Bodybuilder;
    userid?: number;
    user?: User;
    [key: string]: any;
}