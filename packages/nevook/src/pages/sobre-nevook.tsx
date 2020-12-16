import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { getJwtFromCookie } from '@Lib/login/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '@Lib/utils/ssr.utils';
import { getThemeFromCookie } from '@Lib/utils/theme.utils';
import { decode } from 'jsonwebtoken';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const SobreNosotros = () => <h1>Sobre Nevook</h1>;

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	const props: GSSProps = { lostAuth: false };
	const isSSR = isRequestSSR(ctx.req.url);

	const jwt = getJwtFromCookie(ctx.req.headers.cookie);

	if (jwt) {
		if (isSSR) {
			const apolloClient = createApolloClient();
			const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

			if (authProps) props.authProps = authProps;
		} else if (!decode(jwt)) props.lostAuth = true;
	}

	props.componentProps = { theme: getThemeFromCookie(ctx.req.headers.cookie) };

	return {
		props,
	};
};

export default SobreNosotros;