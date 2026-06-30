export declare const UserCategory: {
    readonly RESEARCHER: "researcher";
    readonly UNIVERSITY: "university";
    readonly CONF_ORGANIZER: "conf_organizer";
    readonly PUBLIC_VISITOR: "public_visitor";
    readonly INNOVATOR: "innovator";
    readonly ADMIN: "admin";
};
export type UserCategory = (typeof UserCategory)[keyof typeof UserCategory];
export declare class User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    qualification?: string;
    Position?: string;
    Field?: string;
    ResearchArea?: string;
    user_category: UserCategory;
    university_name?: string;
    password: string;
    is_active: boolean;
    age?: number;
    location?: string;
    details?: string;
    profile_image?: string;
    is_staff: boolean;
    bio?: string;
    orcid?: string;
    cv?: string;
    resume?: string;
    isExpert: boolean;
    generateId(): void;
    hashPassword(): Promise<void>;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
}
