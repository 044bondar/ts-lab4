export interface User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    gender: 'male' | 'female';
    email: string;
    phone: string;
    username: string;
    password?: string;
    image?: string;
}

export type CreateUserDto = Omit<User, 'id'>;
export type UpdateUserDto = Partial<CreateUserDto>;

export interface UsersResponse {
    users: User[];
    total: number;
    skip: number;
    limit: number;
}