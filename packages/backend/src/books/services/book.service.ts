import { FOLDER_UPLOADS_BOOKS } from './../../common/utils/file-upload';
import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { promises as fspromises } from 'fs';
import { IPaginate } from '@Common/interfaces/mongoose.interface';
import { ObjectID } from '@Common/interfaces/mongoose.interface';
import { IUserDoc } from '@Users/interfaces/user-document.interface';
import { IGenreDoc } from '@Genres/interfaces/genre-document.interface';
import { IAuthorDoc } from '@Authors/interfaces/author-document.interface';
import { BookCreateDto } from '@Books/dto/book-create.dto';
import { IBookDoc, TBookModel } from '@Books/interfaces/book-document.interface';
import { BookErrors } from '@Books/enums/book-errors.enum';
import { BookModifyDto } from '@Books/dto/book-modify.dto';
import { Env } from '@Common/enums/env.enum';
import { resolve } from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { BookModels } from '@Books/enums/book-models.enum';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(BookModels.BOOK)
        private readonly bookModel: Model<TBookModel>,
        private readonly configService: ConfigService
    ) { }


    //#region Public

    /**
     * Finds all existing books.
     *
     * @return Book array
     */
    publicFind(): Promise<IBookDoc[]> {
        return this.bookModel.find()
            .populate('author')
            .populate('genre')
            .populate('createdBy')
            .exec() as Promise<IBookDoc[]>;
    }

    /**
     *Finds a book by slug and populate Genre Author
     *
     * @param bookSlug Book slug
     * @return Book with Genre, Author and User (createdBy)
     */
    publicFindBySlugAndPopulate(
        bookSlug: string
    ): Promise<IBookDoc<IUserDoc, IAuthorDoc, IGenreDoc | undefined>> {
        return this.bookModel
            .findOne({ slug: bookSlug })
            .populate('author')
            .populate('genre')
            .exec() as Promise<IBookDoc<IUserDoc, IAuthorDoc, IGenreDoc>>
    }


    /**
     * Finds some books by an array of slugs.
     *
     * @param bookSlugs Book slugs array
     * @return Book array
     */
    publicFindBySlugArray(bookSlugs: string[]): Promise<IBookDoc[]> {
        return this.bookModel
            .find({ slug: { $in: [...bookSlugs] } })
            .exec() as Promise<IBookDoc[]>;
    }

    /**
     * Finds books with same author
     *
     * @param bookAuthor Book Author ObjectID
     */
    async publicFindBySameAuthorPaginate(
        bookAuthor: ObjectID,
        offset: number = 0,
        limit: number = 10,
    ): Promise<IPaginate<IBookDoc>> {
        return {
            data: (await this.bookModel
                .find({ author: bookAuthor })
                .populate('author')
                .populate('genre')
                .skip(offset)
                .limit(limit)
                .exec()) as IBookDoc[],
            limit,
            offset,
            total: await this.bookModel.countDocuments().exec()

        }
    }

    /**
     * Finds books with same genre
     *
     * @param bookGenre Book Genre ObjectID
     */
    async publicFindBySameGenrePaginate(
        bookGenre: ObjectID,
        offset: number = 0,
        limit: number = 10,
    ): Promise<IPaginate<IBookDoc>> {
        return {
            data: (await this.bookModel
                .find({ genre: bookGenre })
                .populate('author')
                .populate('genre')
                .skip(offset)
                .limit(limit)
                .exec()) as IBookDoc[],
            limit,
            offset,
            total: await this.bookModel.countDocuments().exec()

        }
    }

    /**
     *
     * @param bookAuthor Book Author ObjectID
     * @param size Size of books returned randomly.
     * By defaults is 5
     */
    async publicFindRandomBookByAuthor(
        bookAuthor: ObjectID,
        size: number = 5
    ) {
        return await this.bookModel.aggregate(
            [{ $sample: { size: size } }]
        )
    }


    //#endregion

    //#region Find


    /**
     * Finds all existing books (with pagination)
     *
     * @param offset Number of elements to skip
     * @param limit Number of elements to return
     * @return Books array paginated
     */
    async findPaginate(
        offset: number = 0,
        limit: number = 10
    ): Promise<IPaginate<IBookDoc>> {
        return {
            data: (await this.bookModel
                .find()
                .populate('author')
                .populate('genre')
                .populate('createdBy')
                .skip(offset)
                .limit(limit)
                .exec()) as IBookDoc[],
            limit,
            offset,
            total: await this.bookModel.countDocuments().exec()
        };
    }


    /**
     * Finds a book by slug.
     * @param bookSlug Book slug
     */
    findBySlug(bookSlug: string): Promise<IBookDoc | undefined> {
        return this.bookModel
            .findOne({ slug: bookSlug })
            .exec() as Promise<IBookDoc>;
    }


    /**
     * Finds a book by id
     * @param bookId Book ObjectID
     */
    findById(bookId: ObjectID): Promise<IBookDoc | undefined> {
        return this.bookModel.findById(bookId).exec() as Promise<IBookDoc>;
    }


    /**
     * Finds a book by id and populate all the users (createdBy)
     * @param bookId Author ObjectID
     */
    findByIdAndPopulate(
        bookId: ObjectID
    ): Promise<IBookDoc<IUserDoc, IAuthorDoc, IGenreDoc> | undefined> {
        return this.bookModel
            .findById(bookId)
            .populate('author')
            .populate('genre')
            .populate('createdBy')
            .exec() as Promise<IBookDoc<IUserDoc, IAuthorDoc, IGenreDoc>>
    }

    /**
     * Finds an book by id and populate all the users (createdBy)
     * @param bookId Author slug
     */
    findBySlugAndPopulate(
        bookSlug: ObjectID
    ): Promise<IBookDoc<IUserDoc, IAuthorDoc, IGenreDoc> | undefined> {
        return this.bookModel
            .findOne({ slug: bookSlug })
            .populate('author')
            .populate('genre')
            .populate('createdBy')
            .exec() as Promise<IBookDoc<IUserDoc, IAuthorDoc, IGenreDoc>>
    }

    /**
     * Populated users (createdBy) from a author document
     * @param author Author mongoose document
     */
    populateUsers(book: IBookDoc): Promise<IBookDoc<IUserDoc, IAuthorDoc, IGenreDoc>> {
        return (book
            .populate('createdBy')
            .execPopulate() as Partial<IBookDoc>) as Promise<IBookDoc<IUserDoc, IAuthorDoc, IGenreDoc>>;
    }

    //#endregion

    //#region Book


    /**
     * Creates a new Book
     *
     * @param bookData Book creation data
     * @param user New book ObjectId
     */
    async create(bookData: BookCreateDto, user: IUserDoc): Promise<ObjectID> {
        const { slug } = bookData;
        const existingBook = await this.findBySlug(slug);
        if (existingBook) throw new ConflictException(BookErrors.BOOK_ALREADY_EXISTS);

        const book = await this.bookModel.create({
            ...bookData,
            createdBy: user
        });
        return book._id;
    }



    async modifyBook(bookId: ObjectID,
        { title, slug, isbn, synopsis, author, genre }: BookModifyDto): Promise<ObjectID> {
        const existingBook = await this.findById(bookId);
        if (existingBook) throw new NotFoundException(BookErrors.BOOK_NOT_FOUND);

        if (title) existingBook.title = title;
        if (slug) {
            const existingBookBySlug = await this.findBySlug(slug);
            if (existingBookBySlug) throw new ConflictException(BookErrors.BOOK_ALREADY_EXISTS);
            existingBookBySlug.slug = slug;
        };
        if (synopsis) existingBook.synopsis = synopsis;
        if (author) existingBook.author = author;
        if (genre) existingBook.genre = genre;
        if (isbn) existingBook.isbn = isbn;
        const book = await existingBook.save();
        return book._id;
    }


    /**
     * Remove an existing book
     *
     * @param bookId Book ObjectId
     */
    async deleteBook(bookId: ObjectID): Promise<void> {
        const existingBook = await this.findById(bookId);
        if (!existingBook) throw new NotFoundException(BookErrors.BOOK_NOT_FOUND);

        existingBook.remove();
    }


    //#endregion

    /**
     * Sets a new book cover
     *
     * @param bookId Book ObjectId
     * @param filename Cover path
     * @returns new cover url
     */
    async setBookCover(bookId: ObjectID, filename: string): Promise<string> {
        const book = await this.findById(bookId);
        if (!book) throw new NotFoundException(BookErrors.BOOK_NOT_FOUND);

        if (book.cover)
            await fspromises
                .unlink(
                    resolve(
                        FOLDER_UPLOADS_BOOKS,
                        book.cover.replace(
                            this.configService.get(Env.SELF_DOMAIN) +
                            this.configService.get(Env.UPLOADS_STATICS_PATH_BOOKS) +
                            '/',
                            ''
                        )
                    )
                )
                .catch(error => Logger.error(error));
        book.cover =
            this.configService.get(Env.SELF_DOMAIN) +
            this.configService.get(Env.UPLOADS_STATICS_PATH_BOOKS) +
            '/' +
            filename;
        await book.save();
        return book.cover;
    }

}
