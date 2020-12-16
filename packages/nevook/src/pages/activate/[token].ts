import { FC, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { AlertMessages } from '@Enums/config/constants';

import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';

import { checkActivationToken } from '@Lib/utils/user.utils';
import { removeJwtCookie } from '@Lib/login/jwt-cookie.utils';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { getThemeFromCookie } from '@Lib/utils/theme.utils';

const ActivateToken: FC = () => {
	const router = useRouter();

	useEffect(() => {
		router.push(MainPaths.LOGIN);
		toast.success(AlertMessages.ACTIVATION_SUCCESS);
	}, [router]);

	return null;
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	params,
	res,
}) => {
	const props: GSSProps = {};

	if (params && params.token) {
		const checkToken = await checkActivationToken(params.token);
		if (checkToken) {
			removeJwtCookie(res);
		} else {
			res.statusCode = HTTPStatusCodes.NOT_FOUND;
		}
	}

	props.componentProps = {
		theme: getThemeFromCookie(req.headers.cookie),
	};

	return { props: {} };
};

export default ActivateToken;
