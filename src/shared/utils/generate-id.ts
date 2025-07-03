import ObjectID from 'bson-objectid';

export const generateRecordId = () => {
	return new ObjectID().toString();
};
