// import { GSSProps } from '@Interfaces/props/gss-props.interface';
// import { createApolloClient } from '@Lib/apollo/apollo-client';
// import { isRequestSSR } from '@Lib/utils/ssr.utils';
// import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import React, { FC } from 'react';
import { GraphqlBook } from 'nevook-utils';
import BookItem from './book-item';
import { PublicBook } from '@Interfaces/book/book.interface';
import { useQuery } from '@apollo/client';

const BookList: FC = () => {
  const { data } = useQuery(GraphqlBook.book_public_find);
  const books = data ? data.book_public_find : null;

  return (
    <>
      <section className=' p-5 bg-gray-100 dark:bg-gray-800'>
        <h2 className='w-full text-center text-gray-800 dark:text-gray-200 mb-3 text-4xl font-bold'>
          Últimos libros añadidos a Nevook
        </h2>
        <div className='grid grid-cols-5 gap-3'>
          {books &&
            books.map((book: PublicBook) => (
              <>
                <BookItem
                  _id={book._id}
                  key={book._id}
                  slug={book.slug}
                  cover={book.cover}
                  title={book.title}
                  author={book.author}
                  genre={book.genre}
                />
              </>
            ))}
        </div>
      </section>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (
//   ctx: GetServerSidePropsContext
// ) => {
//   const props: GSSProps = { lostAuth: false };
//   const isSSR = isRequestSSR(ctx.req.url);

//   if (isSSR) {
//     const apolloClient = createApolloClient();
//     const query = GraphqlBook.book_public_find;

//     await apolloClient.query({
//       query,
//     });
//     props.apolloCache = apolloClient.cache.extract();
//   }

//   return {
//     props,
//   };
// };

export default BookList;
