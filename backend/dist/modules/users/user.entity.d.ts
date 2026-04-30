export declare enum UserRole {
    SUPERADMIN = "SuperAdmin",
    ADMIN = "Admin Local",
    WAITER = "Mozo",
    CHEF = "Cocinero",
    DINER = "Comensal"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}
