export interface UserRegisterDTO
{
    name: string;
    password: string;

    bio: string;
    location: string;

    birthday?: string;
    gender?: string;
    maritalStatus?: string;
}