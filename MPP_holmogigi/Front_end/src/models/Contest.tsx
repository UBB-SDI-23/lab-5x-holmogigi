import { Coach } from "./Coach";
import { Bodybuilder } from "./Bodybuilder"

export interface Contest
{
    datetime: string;
    name: string;
    location: string;
    coachid: number;
    bodybuilderid: number;

    coach?: Coach;
    bodybuilder?: Bodybuilder;

    [key: string]: any;
}