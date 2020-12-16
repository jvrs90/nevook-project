import { FC } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import ProfileLayout from '@Components/layouts/profile.layout';

import { ProfilePaths } from '@Enums/paths/profile-paths.enum';

import { GSSProps } from '@Interfaces/props/gss-props.interface';

import { withCSRAllowPaths } from '@Lib/hoc/with-csr-allow-paths.hoc';
import {
	loadAuthProps,
	serverRedirect,
	isRequestSSR,
} from '@Lib/utils/ssr.utils';
import { IRedirect } from '@Interfaces/redirect.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { withCSRRedirect } from '@Lib/hoc/with-csr-redirect.hoc';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import { getJwtFromCookie } from '@Lib/login/jwt-cookie.utils';
import { decode } from 'jsonwebtoken';
import { getThemeFromCookie } from '@Lib/utils/theme.utils';

export type ProfileSectionProps = {
	path: ProfilePaths;
};

const ProfileSection: FC<ProfileSectionProps> = ({ path }) => (
	<ProfileLayout path={path} />
);

const allowedPaths: string[] = Object.values(ProfilePaths);

const redirect: IRedirect = {
	href: MainPaths.LOGIN,
	statusCode: 302,
	condition: RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS,
};

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	const props: GSSProps = { lostAuth: false };
	const isSSR = isRequestSSR(ctx.req.url);

	const path = `/perfil/${ctx.params?.section}`;
	const isAllowed = allowedPaths.includes(path);

	redirect.query = { returnTo: path };

	const jwt = getJwtFromCookie(ctx.req.headers.cookie);

	if (jwt) {
		if (isSSR) {
			if (!isAllowed) ctx.res.statusCode = 404;
			const apolloClient = createApolloClient();

			const authProps = await loadAuthProps(ctx.res, jwt, apolloClient, true);

			props.apolloCache = apolloClient.cache.extract();

			if (authProps) props.authProps = authProps;
			else serverRedirect(ctx.res, redirect);
		} else if (!decode(jwt)) props.lostAuth = true;
	} else if (isSSR) serverRedirect(ctx.res, redirect);

	props.componentProps = {
		shouldRender: !!props.authProps,
		path,
		isAllowed,
		theme: getThemeFromCookie(ctx.req.headers.cookie),
	};

	return {
		props,
	};
};

export default withCSRAllowPaths(withCSRRedirect(ProfileSection, redirect));
