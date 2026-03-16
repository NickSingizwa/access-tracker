export interface ServiceStage {
  name: string;
  office: string;
  time: string;
}

export interface PublicService {
  id: string;
  name: string;
  category: string;
  description: string;
  requirements: string[];
  stages: ServiceStage[];
}

export interface Certificate {
  id: string;
  name: string;
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
}

export interface User {
  id: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  password: string;
}
