import { useQuery } from '@apollo/client';
import Head from '@Components/generic/head';
import ProfileMenu from '@Components/profile/profile-menu';
import ProfileMenuNevook from '@Components/profile/profile-menu-nevook';
import ProfileMobileNav from '@Components/profile/profile-mobile-nav';
import ProfileAccounts from '@Components/profile/sections/profile-accounts';
import ProfileData from '@Components/profile/sections/profile-data';
import ProfileFollow from '@Components/profile/sections/profile-follow';
import ProfileHelp from '@Components/profile/sections/profile-help';
import ProfilePassword from '@Components/profile/sections/profile-password';
import ProfilePreferences from '@Components/profile/sections/profile-preferences';
import ProfileSummary from '@Components/profile/sections/profile-summary';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';
import { ProfileContext } from '@Lib/context/profile.context';
import { BrowserContext } from '@Lib/context/resolution.context';
import { GraphqlUser } from 'nevook-utils';
import { useRouter } from 'next/router';
import { FC, useContext } from 'react';

export type ProfileLayoutProps = {
	path: ProfilePaths;
};

const ProfileLayout: FC<ProfileLayoutProps> = ({ path }) => {
	const { browserPreferences } = useContext(BrowserContext);

	const router = useRouter();

	const isRoot = path === ProfilePaths.ROOT;
	if (!browserPreferences.isMobile && isRoot)
		router.replace(ProfilePaths.SUMMARY);

	const components = {
		[ProfilePaths.ROOT]: {
			Component: browserPreferences.isMobile ? ProfileMenu : null,
			title: 'Mi perfil',
		},
		[ProfilePaths.SUMMARY]: {
			Component: ProfileSummary,
			title: 'Resumen',
		},
		[ProfilePaths.DATA]: {
			Component: ProfileData,
			title: 'Mis datos',
		},
		[ProfilePaths.PREFERENCES]: {
			Component: ProfilePreferences,
			title: 'Mis preferencias',
		},
		[ProfilePaths.ACCOUNTS]: {
			Component: ProfileAccounts,
			title: 'Cuentas y correos',
		},
		[ProfilePaths.PASSWORD]: {
			Component: ProfilePassword,
			title: 'Contraseña',
		},
		[ProfilePaths.HELP]: {
			Component: ProfileHelp,
			title: 'Ayuda',
		},
		[ProfilePaths.FOLLOWS]: {
			Component: ProfileFollow,
			title: 'Seguidores',
		},
		[ProfilePaths.FOLLOWING]: {
			Component: ProfileFollow,
			title: 'Siguiendo',
		},
		[ProfilePaths.SUBSCRIPTION]: {
			Component: ProfileFollow,
			title: 'Mi suscripción',
		},
	};

	// TODO error
	const { data, loading, refetch } = useQuery(GraphqlUser.user_profile);

	if (loading || !data) return null;

	const {
		bio,
		gender,
		birthDate,
		isSocialLogin,
		socialAccounts,
	} = data.user_profile;

	const profile = { bio, gender, birthDate, isSocialLogin, socialAccounts };
	const { Component, title } = (components as any)[path];

	if (!Component) return null;

	return (
		<ProfileContext.Provider value={{ profile, refetch }}>
			<Head
				title={`${title} | Nevook`}
				description={title}
				url={MainPaths.PROFILE}
			/>
			{browserPreferences.isMobile ? (
				<div className='my-1 mx-0_5'>
					{isRoot ? (
						<Component />
					) : (
						<>
							<ProfileMobileNav title={title} />
							<div className='w-full p-1_5 bg-white dark:bg-white-dark'>
								<Component />
							</div>
						</>
					)}
				</div>
			) : (
				<div className='container-full mx-auto flex-sa-s'>
					<div className='w-1/6'>
						<ProfileMenu />
					</div>
					<div className='w-1/2 p-1'>
						<div className='w-full p-1_5  bg-white dark:bg-white-dark'>
							<h1 className='text-2xl uppercase font-semibold mb-1 text-white-dark dark:text-white'>
								{title}
							</h1>
							<Component />
						</div>
					</div>
					<div className='w-1/6'>
						<ProfileMenuNevook />
					</div>
				</div>
			)}
		</ProfileContext.Provider>
	);
};

export default ProfileLayout;
