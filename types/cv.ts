export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  website: string
  headline: string
  profileImage: string
}

export interface Experience {
  id: string
  position: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string[]
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  graduationYear: string
  gpa?: string
}

export interface Skill {
  id: string
  name: string
  level: number
}

export interface Language {
  id: string
  name: string
  level: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate: string
  url?: string
}

export interface Publication {
  id: string
  title: string
  publisher: string
  date: string
  url?: string
  description?: string
}

export interface Volunteering {
  id: string
  organization: string
  role: string
  startDate: string
  endDate: string
  description: string[]
}

export interface Award {
  id: string
  title: string
  issuer: string
  date: string
  description?: string
}

export interface Interest {
  id: string
  name: string
  category?: string
}

export interface CVData {
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
  projects: Project[]
  publications: Publication[]
  volunteering: Volunteering[]
  awards: Award[]
  interests: Interest[]
}

export type Template = "james-watson" | "rachel-marsh" | "steven-edward" | "jeremy-torres"
