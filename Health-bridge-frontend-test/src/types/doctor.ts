export interface Doctor {
	id: string;
	fullName: string;
	email?: string;
	phoneNumber?: string;
	specialization?: string;
	qualifications?: string[];
	experience?: number;
	consultationFee?: number;
	rating?: number;
	availableToday?: boolean;
	profileImage?: string;
}
