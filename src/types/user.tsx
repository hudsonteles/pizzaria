export interface User {
    id: string;
    name: string;
    lastname: string;
    email: string;
    group: 'admin' | 'user' | 'superadmin';
    active: boolean;
    expirateInviteDate: Date | null;
}
