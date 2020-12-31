import React, { FC, useState } from 'react';

const ProfileCreateList: FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className='text-2xl font-semibold dark:text-gray-100'>
          LIBROS 2021
        </h1>
        <button className='bg-cta p-1 rounded font-semibold text-white'>Guardar</button>
      </div>

      <form>
        <input
          className='w-full shadow focus:shadow-xl dark:bg-gray-600 dark:text-gray-100 p-1 my-2 rounded'
          type='text'
          placeholder='Título de tu nueva lista'
        />
        <textarea
          className='w-full shadow focus:shadow-xl dark:bg-gray-600 dark:text-gray-100 p-1 mb-2 rounded'
          placeholder='Descripción de tu lista'
          name=''
          id=''
          cols={30}
          rows={10}></textarea>

        <input
          className='w-full shadow focus:shadow-xl dark:bg-gray-600 dark:text-gray-100 p-1 my-2 rounded'
          type='text'
          placeholder='Título de tu nueva lista'
        />

        <SearchBookItemList />
        <SearchBookItemList />
        <SearchBookItemList />
        <SearchBookItemList />
        <SearchBookItemList />
      </form>

      <BookAddedContainer />
    </div>
  );
};

const SearchBookItemList = () => {
  return (
    <>
      <div className='flex justify-start hover:bg-gray-700 p-1 rounded cursor-pointer'>
        <figure>
          <img
            className='w-full rounded'
            src='https://via.placeholder.com/60x75'
            alt='Poratada'
          />
        </figure>
        <div className='text-white pl-0_25'>
          <p>Nacidos de la bruma. Imperio final.</p>
          <p>BRANDOM SANDERSON</p>
          <p>FANTASÍA</p>
        </div>
      </div>
    </>
  );
};

const BookAddedContainer = () => {
  return (
    <>
      {/* //TODO: Hacer esto a través de Context API */}
      <div className='SearchListContainer grid grid-cols-5 gap-1'>
        <BookAddedToList />
        <BookAddedToList />
        <BookAddedToList />
        <BookAddedToList />
        <BookAddedToList />
        <BookAddedToList />
      </div>
    </>
  );
};

const BookAddedToList = () => {
  return (
    <>
      <div className='relative w-auto'>
        <div className='absolute top-1 cursor-pointer right-1 bg-red-500 p-0_25 rounded-full w-1_25 h-1_25 text-white text-sm flex items-center justify-center font-bold'>
          X
        </div>
        <figure>
          <img
            className='w-full rounded'
            src='https://via.placeholder.com/60x75'
            alt='Poratada'
          />
        </figure>
      </div>
    </>
  );
};

export default ProfileCreateList;
