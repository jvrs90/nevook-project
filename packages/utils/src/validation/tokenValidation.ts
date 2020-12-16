import { decode } from 'jsonwebtoken';

/**
 * Jsonwebtoken validation
 *
 * - Jwt format
 * @param value Value to validate
 * @returns Is valid
 */
export const validateJwt = (value: string): boolean => {
	if (decode(value)) return true;
	return false;
};