import MenuLiLink from '@Components/generic/menu/menu-li-link';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';
import { UserIcon } from '@Icons/menu/user-icon';
import { AuthContext } from '@Lib/context/auth.context';
import {  useRouter } from 'next/router';
import {  FC, useContext } from 'react';

const ProfileMenuNevook: FC = () => {
	const { stateAuth } = useContext(AuthContext);

	const router = useRouter();
	const currentPath = router.asPath.split('?')[0];

	const { user } = stateAuth;

	if (!user) return null;

	return (
		<div className='w-full p-1'>
            <h2 className='mb-0_5 text-xl font-semibold text-primary dark:text-cta'>Estadisticas</h2>
			<ul className='mt-0_5 shadow bg-white dark:bg-white-dark text-white-dark dark:text-white'>
				<MenuLiLink
					href={ProfilePaths.FOLLOWING}
					active={currentPath === ProfilePaths.FOLLOWING}
					label='Usuarios que sigo'
					icon={UserIcon}
				/>
                <MenuLiLink
					href={ProfilePaths.FOLLOWS}
					active={currentPath === ProfilePaths.FOLLOWS}
					label='Mis seguidores'
					icon={UserIcon}
				/>
			</ul>
            <h2 className='mt-3 mb-0_5 text-xl font-semibold text-primary dark:text-cta'>Listas</h2>
			<ul className='mt-0_5 shadow rounded-lg bg-white dark:bg-white-dark text-white-dark dark:text-white'>
				<MenuLiLink
					href={ProfilePaths.FOLLOWING}
					active={currentPath === ProfilePaths.FOLLOWING}
					label='Ver mis listas'
					icon={UserIcon}
				/>
                <MenuLiLink
					href={ProfilePaths.FOLLOWS}
					active={currentPath === ProfilePaths.FOLLOWS}
					label='Crear lista'
					icon={UserIcon}
				/>
			</ul>

            <h2 className='mt-3 mb-0_5 text-xl font-semibold text-primary dark:text-cta'>Libros</h2>
			<ul className='mt-0_5 shadow rounded-lg bg-white dark:bg-white-dark text-white-dark dark:text-white'>
				<MenuLiLink
					href={ProfilePaths.FOLLOWING}
					active={currentPath === ProfilePaths.FOLLOWING}
					label='Libros favoritos'
					icon={UserIcon}
				/>
			</ul>
            <h2 className='mt-3 mb-0_5 text-xl font-semibold text-primary dark:text-cta'>Reseñas</h2>
			<ul className='mt-0_5 shadow rounded-lg bg-white dark:bg-white-dark text-white-dark dark:text-white'>
				<MenuLiLink
					href={ProfilePaths.FOLLOWING}
					active={currentPath === ProfilePaths.FOLLOWING}
					label='Mis reseñas'
					icon={UserIcon}
				/>
                <MenuLiLink
					href={ProfilePaths.FOLLOWING}
					active={currentPath === ProfilePaths.FOLLOWING}
					label='Escribir reseña'
					icon={UserIcon}
				/>
			</ul>
		</div>
	);
};


export default ProfileMenuNevook;
