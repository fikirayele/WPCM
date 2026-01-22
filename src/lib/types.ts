export type UserRole = 'student' | 'consultant' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  departmentId?: string; // For consultants
  active?: boolean;
}


export interface Department {
  id:string;
  name: string;
  description: string;
}

export type ConsultationStatus = 'PENDING' | 'ASSIGNED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'AWAITING_ACCEPTANCE';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Consultation {
  id:string;
  studentId: string;
  consultantId?: string;
  
  // Consultation specific
  departmentId: string;
  problemDescription: string;
  preferredTime: string;
  status: ConsultationStatus;
  createdAt: string;
  lastMessageAt?: string;
  messages: Message[];
  studentAccepted?: boolean;
  consultantAccepted?: boolean;
  testimonial?: string;

  // Submitter's info at time of request
  fullName: string;
  phoneNumber: string;
  email: string;
  telegramUsername?: string;
  motherChurch: string;
  entryYear: string;
  departmentName: string;
  schoolLevel: 'Remedial' | 'First Year' | 'Second Year' | 'Third Year' | 'Fourth Year' | 'Fifth Year' | 'Sixth Year' | 'Seventh Year';
  graduationYear: string;
  studentStatus1: 'Regular' | 'Irregular (Private)';
  studentStatus2: 'Degree Program' | 'MS Program';
  studentStatus3: 'Current WPCM' | 'Alumni WPCM';
  talents: string[];
  specialCare: string[];
  photoUrl?: string;
  comments?: string;
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
  email?: string;
  amount: number;
  date: string;
  phoneNumber: string;
  transactionId: string;
  screenshotUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
}
