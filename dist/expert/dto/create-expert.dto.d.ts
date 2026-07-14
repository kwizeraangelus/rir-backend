declare class PortfolioDto {
    title: string;
    description: string;
    technologies: string[];
}
declare class WorkExperienceDto {
    position: string;
    company: string;
    startYear: number;
    endYear?: number;
    description: string;
    technologies: string[];
}
declare class EducationDto {
    degree: string;
    institution: string;
    startYear: number;
    endYear: number;
}
declare class CertificationDto {
    name: string;
    issuer: string;
    dateObtained: string;
}
declare class SkillsDto {
    libraries?: string[];
    tools?: string[];
    languages?: string[];
    paradigms?: string[];
    platforms?: string[];
    storage?: string[];
    frameworks?: string[];
    other?: string[];
}
export declare class CreateExpertDto {
    name: string;
    title: string;
    location: string;
    bio: string;
    profileImage?: string;
    yearOfExperience: number;
    expertise: string[];
    portfolio: PortfolioDto[];
    workExperience: WorkExperienceDto[];
    education: EducationDto[];
    certifications: CertificationDto[];
    skills: SkillsDto;
    preferredEnvironment: string[];
    verified?: boolean;
}
export {};
