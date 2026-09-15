export interface Notification {
	id: string;
	recipientId?: string;
	type?: string;
	title: string;
	message: string;
	referenceType?: string;
	referenceId?: string;
	read: boolean;
	createdAt: string;
}
