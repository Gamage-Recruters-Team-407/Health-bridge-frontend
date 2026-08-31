export type TicketStatus = "OPEN" | "PROCESSING" | "SOLVED";

export interface TicketReply {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "USER" | "ADMIN";
  message: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  attachmentUrl: string | null;
  status: TicketStatus;
  replies: TicketReply[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketSummary {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  status: TicketStatus;
  hasAttachment: boolean;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
}
