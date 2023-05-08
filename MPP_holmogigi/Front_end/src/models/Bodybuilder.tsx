﻿import { User } from "./User";

export interface Bodybuilder
{
    id?: number;
    name: string;
    age: number;
    weight: number;
    height: number;
    division: string;
    userid?: number;
    user?: User;
    [key: string]: any;
}