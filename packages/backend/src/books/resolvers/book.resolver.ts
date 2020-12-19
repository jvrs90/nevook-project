import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
    Book,
    BookPaginated,
    FullBook,
} from '@Books/types/book.type';
import { IBookDoc } from '@Books/interfaces/book-document.interface';
import { BookErrors } from '@Books/enums/book-errors.enum';
import { BookModifyDto } from '@Books/dto/book-modify.dto';
import { BookService } from '@Books/services/book.service';
import { IPaginate } from '@Common/interfaces/mongoose.interface';
import { ObjectIDPipe } from '@Common/pipes/objectid.pipe';
import { ObjectIDArrayPipe } from '@Common/pipes/objectid-array.pipe';
import { ObjectID } from '@Common/interfaces/mongoose.interface';
import { PaginateDto } from '@Common/types/paginate-filter.types';
import { IUserDoc } from '@Users/interfaces/user-document.interface';
import { Auth } from '@Users/auth/auth.decorator';
import { UserGqlAuthGuard } from '@Users/auth/user-gql-auth.guard';
import { AppResource } from '@Users/enums/user-roles.enum';
import { BookCreateDto } from '@Books/dto/book-create.dto';
import { BookCreatePipe } from '@Books/pipes/book-create.pipe';
import { BookModifyPipe } from '@Books/pipes/book-modify.pipe';
import { GetGqlAuthUser } from '@Common/auth/get-user.decorator';
import { IGenreDoc } from '@Genres/interfaces/genre-document.interface';
import { IAuthorDoc } from '@Authors/interfaces/author-document.interface';


@Resolver(() => Book)
export class BookResolver {

    /**
     * Dependecy injection
     * @param bookService Book service
     */
    constructor(private readonly bookService: BookService) { }

    //#region Public

    /**
     * Finds all existing books.
     *
     * - AUTH Public
     * @return Books aray
     */
    @Query(() => [Book])
    book_public_find(): Promise<IBookDoc[]> {
        return this.bookService.publicFind();
    }


    /**
     * Finds some book by an array of slugs
     *
     * - AUTH: Public
     * @param bookSlugs Book slugs array
     * @return Book data array
     */
    @Query(() => [Book])
    book_public_find_by_slug_array(
        @Args('bookSlugs', { type: () => [String]! }, ObjectIDArrayPipe)
        bookSlugs: ObjectID[]
    ): Promise<IBookDoc[]> {
        return this.bookService.publicFindBySlugArray(bookSlugs);
    }

    //#endregion


    //#region Find

    /**
     * Finds all existing books (with pagination)
     *
     * - AUTH
     * @param paginate Pagination options
     * @returns Pagination with books array
     */
    @Query(() => BookPaginated)
    @UseGuards(UserGqlAuthGuard)
    book_admin_find(
        @Args('paginate', { type: () => PaginateDto, nullable: true })
        paginate: PaginateDto
    ): Promise<IPaginate<IBookDoc>> {
        return this.bookService.findPaginate(
            (paginate && paginate.offset) || 0,
            (paginate && paginate.limit) || 10
        )
    }


    /**
     * Finds a Book by id (and populate book user (createdBy))
     *
     * -AUTH
     * @param bookId Book ObjectId
     * @returns Book data
     */
    @Query(() => FullBook)
    @UseGuards(UserGqlAuthGuard)
    async book_admin_find_by_id(
        @Args('bookId', { type: () => ID }, ObjectIDPipe)
        bookId: ObjectID
    ): Promise<IBookDoc<IUserDoc, IAuthorDoc, IGenreDoc>> {
        const book = await this.bookService.findByIdAndPopulate(bookId);
        if (!book) throw new NotFoundException(BookErrors.BOOK_NOT_FOUND);
        return book
    }

    //#endregion

    //#region Book

    /**
     * Creates a new book.
     *
     * - AUTH: Users
     * - ROLES: ADMIN | SUPER_ADMIN
     * @param bookData Book creation data
     * @returns Book object id
     */
    @Mutation(() => ID)
    @Auth({action: 'create', possession:'any', resource: AppResource.BOOK })
    async book_admin_create(
        @Args('bookData', { type: () => BookCreateDto }, BookCreatePipe)
        bookData: BookCreateDto,
        @GetGqlAuthUser() user: IUserDoc
    ): Promise<ObjectID> {
        //TODO: averiguar como obtener el usuario logueado
        return this.bookService.create(bookData, user);
    }

    /**
     * Modifies an axisting book data.
     *
     * - AUTH: User
     * - Roles: ADMIN | SUPER_ADMIN
     * @param bookId Book ObjectId
     * @param input True if success
     */
    @Mutation(() => ID)
    @Auth({action: 'update', possession:'any', resource: AppResource.BOOK })
    async book_admin_modify(
        @Args('bookId', { type: () => ID }, ObjectIDPipe)
        bookId: ObjectID,
        @Args('input', { type: () => BookModifyDto }, BookModifyPipe)
        input: BookModifyDto
    ): Promise<ObjectID> {
        return await this.bookService.modifyBook(bookId, input);
    }

    /**
     * Remove an existing book.
     * Before delteing a book
     *
     * - AUTH: User
     * - ROLES: Super_admin
     * @param bookId Book ObjectId
     * @return True if success
     */
    @Mutation(() => ID)
    @Auth({action: 'delete', possession:'any', resource: AppResource.BOOK })
    async book_admin_delete(
        @Args('bookId', { type: () => ID }, ObjectIDPipe)
        bookId: ObjectID
    ): Promise<boolean> {
        await this.bookService.deleteBook(bookId)
        return true
    }

    //#endregion
}





