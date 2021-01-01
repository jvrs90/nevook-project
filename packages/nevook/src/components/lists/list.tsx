import { FC } from 'react';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import BookItem from '@Components/book/book-item';
import { GraphqlBook } from 'nevook-utils';
import { useQuery } from '@apollo/client';
import { LockClosedIcon } from '@Components/icons/generic/lock-closed-icon';
import { EllipseVerticalIcon } from '@Components/icons/generic/ellipse-vertical-icon';

export type ListProps = {
  title: string;
  isPrivate: boolean;
};

const List: FC<ListProps> = ({ title, isPrivate }) => {
  const { data } = useQuery(GraphqlBook.book_public_find);
  const books = data ? data.book_public_find : null;

  console.log(books);

  return (
    <div>
      <div className='List my-2'>
        <div className='List__header flex justify-between'>
          <h2 className='text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-1 flex'>
            {isPrivate && <LockClosedIcon width={30} />} {title}
          </h2>
          <button>
            <EllipseVerticalIcon width={30} />
          </button>
        </div>

        <Carousel arrows slidesPerPage={5} slidesPerScroll={4}>
          {books.map((book: any) => (
            <BookItem
              key={book._id}
              className='rounded overflow-hidden'
              {...book}
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default List;
