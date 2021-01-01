import { FC } from 'react';

const ProfileFollow: FC = () => {
  return (
    <>
      <UserFollowList />
    </>
  );
};

const UserFollowList = () => {
  return (
    <>
      <UserFollowItem isFollowing={true} />
      <UserFollowItem isFollowing={false} />
      <UserFollowItem isFollowing={true} />
      <UserFollowItem isFollowing={true} />
      <UserFollowItem isFollowing={false} />
    </>
  );
};

// TODO: Factorizar estos dos componentes
const UserFollowItem = ({ isFollowing }) => {
  return (
    <>
      <div className='UserFollowItem flex justify-between my-1'>
        <div className="flex">
          <img
            className='rounded-full'
            src='https://via.placeholder.com/70x70'
            alt='Foto perfil'
          />
          <div className='pl-0_5'>
            <h1>Jose</h1>
            <p>Descripcion del usuario</p>
          </div>
        </div>

        <button className='bg-cta p-0_5 text-white rounded'>
          {isFollowing ? 'Siguiendo' : 'Seguir'}
        </button>
      </div>
    </>
  );
};

export default ProfileFollow;
