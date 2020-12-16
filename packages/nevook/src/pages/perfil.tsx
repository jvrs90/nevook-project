import ProfileLayout from '@Components/layouts/profile.layout';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { IRedirect } from '@Interfaces/redirect.interface';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { withCSRRedirect } from '@Lib/hoc/with-csr-redirect.hoc';
import { getJwtFromCookie } from '@Lib/login/jwt-cookie.utils';
import {
	isRequestSSR,
	loadAuthProps,
	serverRedirect,
} from '@Lib/utils/ssr.utils';
import { getThemeFromCookie } from '@Lib/utils/theme.utils';
import { decode } from 'jsonwebtoken';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { FC } from 'react';

const Perfil: FC = () => <ProfileLayout  path={ProfilePaths.ROOT} />;

const redirect: IRedirect = {
	href: MainPaths.LOGIN,
	statusCode: 302,
	condition: RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS,
	query: { returnTo: MainPaths.PROFILE },
};

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	const props: GSSProps = { lostAuth: false };
	const isSSR = isRequestSSR(ctx.req.url);

	const jwt = getJwtFromCookie(ctx.req.headers.cookie);

	if (jwt) {
		if (isSSR) {
			const apolloClient = createApolloClient();
			const authProps = await loadAuthProps(ctx.res, jwt, apolloClient, true);

			props.apolloCache = apolloClient.cache.extract();

			if (!authProps) serverRedirect(ctx.res, redirect);
			else props.authProps = authProps;
		} else if (!decode(jwt)) props.lostAuth = true;
	}

	props.componentProps = {
		shouldRender: !!props.authProps,
		theme: getThemeFromCookie(ctx.req.headers.cookie),
	};

	return { props };
};

export default withCSRRedirect(Perfil, redirect);
