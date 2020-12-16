import { NextApiRequest, NextApiResponse } from 'next';
import { ApolloError } from '@apollo/client';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { getJwtFromCookie } from '@Lib/login/jwt-cookie.utils';
import { GraphqlUser } from 'nevook-utils';

const profile = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		res.status(HTTPStatusCodes.METHOD_NOT_ALLOWED).send(false);
		return;
	}

	const client = createApolloClient();

	try {
		const jwt = getJwtFromCookie(req.headers.cookie);

		const response = await client.query({
			fetchPolicy: 'network-only',
			query: GraphqlUser.user_profile,
			context: {
				headers: { Authorization: `Bearer ${jwt}` },
			},
		});
		const user = response.data.user_profile;
		if (user) {
			return res.json({
				jwt,
				user,
			});
		} else {
			res.status(HTTPStatusCodes.NOT_FOUND).send(false);
		}
	} catch (error) {
		if (error instanceof ApolloError && error?.graphQLErrors[0]) {
			res
				.status(error.graphQLErrors[0].extensions?.exception?.status)
				.send({ error: error.message });
		} else {
			res
				.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR)
				.send({ error: 'Error interno del servidor' });
		}
	}
};

export default profile;
