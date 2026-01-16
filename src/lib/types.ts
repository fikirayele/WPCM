export type UserRole = 'student' | 'consultant' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  departmentId?: string;
  active?: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export type ConsultationStatus = 'PENDING' | 'ASSIGNED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Consultation {
  id: string;
  studentId: string;
  consultantId?: string;
  departmentId: string;
  problemDescription: string;
  preferredTime: string;
  status: ConsultationStatus;
  createdAt: string;
  lastMessageAt?: string;
  messages: Message[];
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  author: string;
}

export interface Donation {
    id: string;
    name: string;
    email: string;
    amount: number;
    date: string;
}
