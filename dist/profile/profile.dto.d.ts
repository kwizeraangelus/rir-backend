export declare class UpdateProfileDto {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    age?: number;
    location?: string;
    details?: string;
    institution?: string;
    graduation_university?: string;
    bio?: string;
    orcid?: string;
    qualification?: string;
    ResearchArea?: string;
    Position?: string;
    Field?: string;
    university_name?: string;
    email?: string;
}
export declare class ChangePasswordDto {
    current_password: string;
    new_password: string;
}
declare const UpdateResearcherProfileDto_base: import("@nestjs/mapped-types").MappedType<Omit<UpdateProfileDto, "email" | "first_name" | "last_name" | "phone_number" | "university_name" | "age">>;
export declare class UpdateResearcherProfileDto extends UpdateResearcherProfileDto_base {
    token: string;
    graduation_country?: string;
}
export {};
