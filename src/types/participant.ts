export interface Participant {
    id: string;
    name: string;
    dob: string;
    email: string;
    phone: string;
}

export type SortField = 'name' | 'dob';
export type SortOrder = 'asc' | 'desc';