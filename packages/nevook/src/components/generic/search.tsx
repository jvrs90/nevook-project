import React from 'react';

const Search = () => {
  return (
    <section className='bg-cta dark:bg-gray-900 py-4'>
      <div className='container mx-auto'>
        <h2 className='w-full text-center text-white mb-3 text-4xl font-bold'>
          Busca tu próxima lectura
        </h2>
        <form>
          <input
            className='shadow-md h-2 w-64 p-2 rounded-full text-xl'
            placeholder={'Buscar por: título, autor, género'}
            name={'query'}
            onChange={() => console.log('Input búsqueda onChange')}
          />
        </form>
        <div className='grid gap-1 grid-cols-2 md:grid-cols-5 mt-2 '>
        </div>
      </div>
    </section>
  );
};

export default Search;
