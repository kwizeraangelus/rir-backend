export interface Portfolio {
    title: string;
    description: string;
    technologies: string[];
}
export interface WorkExperience {
    position: string;
    company: string;
    startYear: number;
    endYear?: number;
    description: string;
    technologies: string[];
}
export interface Education {
    degree: string;
    institution: string;
    startYear: number;
    endYear: number;
}
export interface Certification {
    name: string;
    issuer: string;
    dateObtained: Date;
}
export interface Skills {
    libraries?: string[];
    tools?: string[];
    languages?: string[];
    paradigms?: string[];
    platforms?: string[];
    storage?: string[];
    frameworks?: string[];
    other?: string[];
}
export declare class Expert {
    id: string;
    name: string;
    title: string;
    location: string;
    bio: string;
    profileImage?: string;
    yearOfExperience: number;
    expertise: string[];
    portfolio: Portfolio[];
    workExperience: WorkExperience[];
    education: Education[];
    certifications: Certification[];
    skills: Skills;
    preferredEnvironment: string[];
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
