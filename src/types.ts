export interface ContactInfo {
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  address: string;
}

export interface SkillCategory {
  title: string;
  skills: string;
}

export interface Job {
  company: string;
  period: string;
  role: string;
  description: string;
  achievements?: string[];
}

export interface CVData {
  name: string;
  contact: ContactInfo;
  profile: string;
  skills: SkillCategory[];
  workHistory: Job[];
}
