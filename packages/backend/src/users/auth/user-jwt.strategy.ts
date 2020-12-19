import { Env } from '@Common/enums/env.enum';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserTokenPayload } from '@Users/interfaces/user-payload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@Users/services/users.service';
import { IUserDoc } from '@Users/interfaces/user-document.interface';
import { GenericErrors } from '@Common/enums/generic-errors.enum';
import { JwtStrategies } from '@Common/enums/jwt-strategies.enum';

/**
 * JWT custom implementation
 */

// , JwtStrategies.USER
@Injectable()
export class UserJwtStrategy extends PassportStrategy( Strategy, JwtStrategies.USER ) {
    /**
     * @ignore
     */
    constructor(
        private readonly userService: UsersService,
        configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get(Env.USER_TOKEN_KEY),
        });
    }

    /**
     * JWT Validation function
     *
     * @param  {UserTokenPayload} payload
     * @returns Promise
     */
    async validate(payload: UserTokenPayload): Promise<IUserDoc> {
        const { id } = payload;
        const user = await this.userService.findById(id);

        if (!user) throw new UnauthorizedException(GenericErrors.UNAUTHORIZED);

        return user;
    }
}
