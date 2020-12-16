import { JwtStrategies } from '@Common/enums/jwt-strategies.enum';

export interface UserTokenPayload {
	id: string;
	type: JwtStrategies;
}
