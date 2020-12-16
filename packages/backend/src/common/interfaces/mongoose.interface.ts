/**
 * Type to explicitly clarify that the string is a Mongoose objectid
 * */
export type ObjectID = string;

/**
 * Interface that is applied to Mongoose documents, whose model uses timestamps.
 */
export interface IWithMongooseTimestamp {
	/** Creation date */
	createdAt?: Date;
	/** Last update date */
	updatedAt?: Date;
}

/**
 * Interface for paginate a Mongoose query.
 * - T: Results type
 */
export interface IPaginate<T> {
	/** Results of type T */
	data: T[];
	/** Number of elements to return */
	limit: number;
	/** Number of elements to skip */
	offset: number;
	/** All elements count */
	total: number;
}
