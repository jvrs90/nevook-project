import React, { FC } from 'react';
import List from '@Components/lists/list';

const ProfileMyLists: FC = () => {
  return (
    <>
      <section className=''>
        <input
          className='shadow-lg rounded p-1 w-full text-lg dark:bg-gray-700 dark:text-gray-500'
          type='text'
          placeholder='Buscar una lista por su nombre'
        />
        <div className='mt-3'>
          <div className='my-3 p-1 rounded-lg'>
            <List title='Lista de verano' isPrivate={false} />
          </div>
          <div className='my-3 p-1 rounded-lg'>
            <List title='Lista de verano' isPrivate={false} />
          </div>
          <div className='my-3 p-1 rounded-lg'>
            <List title='Lista de verano' isPrivate={true} />
          </div>
          <div className='my-3 p-1 rounded-lg'>
            <List title='Lista de verano' isPrivate={false} />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileMyLists;
