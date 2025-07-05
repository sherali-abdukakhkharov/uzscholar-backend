export interface DissertationEntity {
	id: string;
	created_at?: Date | string;
	created_by?: string;
	created_by_name: string;
	created_year: number;
	code?: string;
	language_code?: string;
	title: string;
	year: number;
	category_id: string;
	sub_category_id?: string;
	description?: string;
	pages?: number;
	is_deleted?: boolean;
	updated_at?: Date;
}
