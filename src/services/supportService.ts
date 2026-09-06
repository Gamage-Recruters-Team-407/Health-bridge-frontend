import { Ticket, TicketStatus, TicketSummary } from "@/types/support";

const API_BASE = "http://localhost:8088";

// Get JWT token from localStorage
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("healthbridge_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;

    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // Response wasn't JSON
    }

    throw new Error(message);
  }

  return res.json();
}

// ---------- User endpoints ----------

export function createTicket(
  subject: string,
  description: string,
  attachment?: File | null
) {
  const formData = new FormData();

  formData.append("subject", subject);
  formData.append("description", description);

  if (attachment) {
    formData.append("attachment", attachment);
  }

  return request<Ticket>("/api/tickets", {
    method: "POST",
    body: formData,
  });
}

export function getMyTickets() {
  return request<TicketSummary[]>("/api/tickets");
}

export function getMyTicketById(id: string) {
  return request<Ticket>(`/api/tickets/${id}`);
}

export function replyAsUser(
  id: string,
  message: string,
  image?: File | null
) {
  const formData = new FormData();

  if (message) {
    formData.append("message", message);
  }

  if (image) {
    formData.append("image", image);
  }

  return request<Ticket>(`/api/tickets/${id}/reply`, {
    method: "POST",
    body: formData,
  });
}

// ---------- Admin endpoints ----------

export function getAllTickets() {
  return request<TicketSummary[]>("/api/admin/tickets");
}

export function getTicketByIdForAdmin(id: string) {
  return request<Ticket>(`/api/admin/tickets/${id}`);
}

export function updateTicketStatus(
  id: string,
  status: TicketStatus
) {
  return request<Ticket>(`/api/admin/tickets/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
}

export function replyAsAdmin(
  id: string,
  message: string,
  image?: File | null
) {
  const formData = new FormData();

  if (message) {
    formData.append("message", message);
  }

  if (image) {
    formData.append("image", image);
  }

  return request<Ticket>(`/api/admin/tickets/${id}/reply`, {
    method: "POST",
    body: formData,
  });
}

function updateReply(path: string, message: string) {
  return request<Ticket>(path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
}

function deleteReply(path: string) {
  return request<Ticket>(path, { method: "DELETE" });
}

export function editReplyAsUser(ticketId: string, replyId: string, message: string) {
  return updateReply(`/api/tickets/${ticketId}/reply/${replyId}`, message);
}

export function deleteReplyAsUser(ticketId: string, replyId: string) {
  return deleteReply(`/api/tickets/${ticketId}/reply/${replyId}`);
}

export function editReplyAsAdmin(ticketId: string, replyId: string, message: string) {
  return updateReply(`/api/admin/tickets/${ticketId}/reply/${replyId}`, message);
}

export function deleteReplyAsAdmin(ticketId: string, replyId: string) {
  return deleteReply(`/api/admin/tickets/${ticketId}/reply/${replyId}`);
}