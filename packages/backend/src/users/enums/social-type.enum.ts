import { registerEnumType } from '@nestjs/graphql';

/**
 * SocialType enum
 */
export enum SocialType {
    GOOGLE = 'GOOGLE',
    FACEBOOK = 'FACEBOOK',
}

registerEnumType(SocialType, { name: 'SocialType' });