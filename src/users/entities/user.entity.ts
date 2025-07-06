export interface UserEntity {
	id: string;
	created_at?: Date | string;
	last_name: string;
	first_name: string;
	middle_name?: string;
	username: string;
	password: string;
	email?: string;
	updated_at?: string;
	is_deleted?: boolean;
}
