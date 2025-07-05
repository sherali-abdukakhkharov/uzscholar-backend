export interface CategoryEntity {
	id: string;
	created_at?: Date | string;
	name: string;
	parent_id: string;
	updated_at?: Date | string;
	is_deleted?: boolean;
	code: number;
}
