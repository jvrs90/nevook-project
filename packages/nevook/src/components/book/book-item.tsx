import Link from 'next/link';
import React from 'react';

const BookItem = ({ title, slug, author, genre, cover, _id }) => {
  return (
    <>
      <article className='book-item cursor-pointer rounded overflow-hidden' key={_id}>
        <Link href={`/libro/${slug}`}>
          <a>
            <div className='book-info relative bg-gray-500'>
              <div className='absolute top-0 left-0 text-white p-1'>
                <h2 className='text-xl'>{title}</h2>
                <h2>{author.name}</h2>
                <h2>{genre.name}</h2>
              </div>
            </div>
            <figure className='book-cover'>
              <img className='w-full h-full' src={cover} alt='Portada' />
            </figure>
          </a>
        </Link>
      </article>
    </>
  );
};

export default BookItem;
