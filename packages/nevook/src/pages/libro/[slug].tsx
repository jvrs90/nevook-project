import { useRouter } from 'next/router';
// import { GSSProps } from '@Interfaces/props/gss-props.interface';
// import { createApolloClient } from '@Lib/apollo/apollo-client';
// import { isRequestSSR } from '@Lib/utils/ssr.utils';
// import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import React, { FC } from 'react';
import { GraphqlBook } from 'nevook-utils';
import { useQuery } from '@apollo/client';
import BookItem from '@Components/book/book-item';

const BookPage: FC = () => {
  const router = useRouter();
  const books = useQuery(GraphqlBook.book_public_find_by_slug, {
    variables: {
      bookSlug: router.query.slug,
    },
  });
  const book = books.data ? books.data.book_public_find_by_slug : null;

 const getAuthor = () => {
   if(!books.loading) return book.author._id;
 }

 const getGenre = () => {
   if(!books.loading) return book.genre._id;
 }

  const byAuthor = useQuery(GraphqlBook.book_public_find_by_author, {
    variables: {
      bookAuthor: getAuthor(), // JK
    },
  });
  const byGenre = useQuery(GraphqlBook.book_public_find_by_genre, {
    variables: {
      bookGenre: getGenre(),
    },
  });
  console.log(byAuthor);
  const bookAuthor = byAuthor.data
    ? byAuthor.data.book_public_find_by_author
    : null;
  const bookGenre = byGenre.data
    ? byGenre.data.book_public_find_by_genre
    : null;

  return (
    <>
      {book && (
        <>
          <section className='BookItem max-w-7xl mx-auto pt-5'>
            <div className='BookItem__container bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl flex flex-wrap items-start'>
              <figure className='w-1/3'>
                <img className='w-100' src={book.cover} alt='Poratada libro' />
              </figure>

              <div className='BookItem__info w-2/3 p-1'>
                <div className='BookItem__info-title'>
                  <h1 className='font-semibold text-2xl dark:text-cta'>
                    {book.title}
                  </h1>
                </div>
                <div className='BookItem__info-author-genre'>
                  <h2 className='text-gray-500 dark:text-gray-400 mb-0.5'>
                    {book.author.name}
                  </h2>
                  <h2 className='text-gray-500 dark:text-gray-400 mb-1'>
                    {book.genre.name}
                  </h2>
                </div>
                <div className='BookItem_info-synopsis'>
                  <h3 className='text-gray-500 dark:text-gray-400'>
                    SINOPSIS:{' '}
                  </h3>
                  <div className='text-gray-700 dark:text-gray-300 text-xl leading-8'>
                    {book.synopsis}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className='max-w-7xl mx-auto pt-5'>
            <h2 className='text-2xl font-bold dark:text-gray-300 mb-1'>
              Te pueden interesar estos libros del mismo autor{' '}
              <span className='text-cta font-bold'>{book.author.name}</span>{' '}
            </h2>
            <div className='grid grid-cols-5 gap-3'>
              {bookAuthor &&
                bookAuthor.data.map((book: any) => (
                  <BookItem
                    key={book._id}
                    title={book.title}
                    slug={book.slug}
                    author={book.author}
                    genre={book.genre}
                    cover={book.cover}
                    _id={book._id}
                  />
                ))}
            </div>
          </section>
          <section className='max-w-7xl mx-auto pt-5 pb-5'>
            <h2 className='text-2xl font-bold dark:text-gray-300 mb-1'>
              Te pueden interesar estos libros del mismo género{' '}
              <span className='text-cta font-bold'>{book.genre.name}</span>
            </h2>
            <div className='grid grid-cols-5 gap-3'>
              {bookGenre &&
                bookGenre.data.map((book: any) => (
                  <BookItem
                    key={book._id}
                    title={book.title}
                    slug={book.slug}
                    author={book.author}
                    genre={book.genre}
                    cover={book.cover}
                    _id={book._id}
                  />
                ))}
            </div>
          </section>
        </>
      )}
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (
//   ctx: GetServerSidePropsContext
// ) => {
//   const props: GSSProps = { lostAuth: false };

//   const apolloClient = createApolloClient();

//   let response = await apolloClient.query({
//     query: GraphqlBook.book_public_find_by_slug,
//     variables: {
//       bookSlug: 'harry-potter-y-el-caliz-de-fuego',
//     },
//   });
//   console.log('🚀 ~ file: [slug].tsx ~ line 37 ~ response', response.data);
//   props.apolloCache = apolloClient.cache.extract();

//   return {
//     props,
//   };
// };

export default BookPage;
