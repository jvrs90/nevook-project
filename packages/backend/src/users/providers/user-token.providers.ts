import { Provider } from '@nestjs/common';
import { TokenService } from '@Users/services/user-token.service';

export const userTokenProviders: Provider[] = [TokenService];