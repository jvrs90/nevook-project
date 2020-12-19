import { ConfigService } from '@nestjs/config';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { Env } from '../enums/env.enum';

/**
 * Graphql module configuration with env
 */
export const GraphqlModule = GraphQLModule.forRootAsync({
	useFactory: (configService: ConfigService): GqlModuleOptions => {
		const isDev = configService.get(Env.NODE_ENV) === 'dev';
		return {
			autoSchemaFile: 'schema.gql',
			debug: true,
			playground: true,
			transformAutoSchemaFile: true,
		};
	},
	inject: [ConfigService],
});
