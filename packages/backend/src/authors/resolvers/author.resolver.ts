import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
    Author,
    AuthorPaginated,
    FullAuthor,
} from '@Authors/types/author.type';
import { IAuthorDoc } from '@Authors/interfaces/author-document.interface';
import { AuthorErrors } from '@Authors/enums/author-errors.enum';
import { AuthorModifyDto } from '@Authors/dto/author-modify.dto';
import { AuthorModifyPipe } from '@Authors/pipes/author-modify.pipe';
import { AuthorService } from '@Authors/services/author.service';
import { IPaginate } from '@Common/interfaces/mongoose.interface';
import { ObjectIDPipe } from '@Common/pipes/objectid.pipe';
import { ObjectIDArrayPipe } from '@Common/pipes/objectid-array.pipe';
import { ObjectID } from '@Common/interfaces/mongoose.interface';
import { PaginateDto } from '@Common/types/paginate-filter.types';
import { IUserDoc } from '@Users/interfaces/user-document.interface';
import { AllowedUserRoles } from '@Users/auth/allowed-user-roles.decorator';
import { UserGqlAuthGuard } from '@Users/auth/user-gql-auth.guard';
import { UserRoles } from '@Users/enums/user-roles.enum';
import { UserGqlRolesGuard } from '@Users/auth/user-gql-roles.guard';



@Resolver(() => Author)
export class AuthorResolver {

    /**
     * Dependecy injection
     * @param authorService Author service
     */
    constructor(private readonly authorService: AuthorService) { }

    //#region Public

    /**
     * Finds all existing authors.
     *
     * - AUTH Public
     * @return Authors aray
     */
    @Query(() => [Author])
    author_public_find(): Promise<IAuthorDoc[]> {
        return this.authorService.publicFind();
    }


    /**
     * Finds some author by an array of slugs
     *
     * - AUTH: Public
     * @param authorSlugs Author slugs array
     * @return Author data array
     */
    @Query(() => [Author])
    author_public_find_by_slug_array(
        @Args('authorSlugs', { type: () => [String]! }, ObjectIDArrayPipe)
        authorSlugs: ObjectID[]
    ): Promise<IAuthorDoc[]> {
        return this.authorService.publicFindBySlugArray(authorSlugs);
    }

    //#endregion


    //#region Find

    /**
     * Finds all existing authors (with pagination)
     *
     * - AUTH
     * @param paginate Pagination options
     * @returns Pagination with authors array
     */
    @Query(() => AuthorPaginated)
    @UseGuards(UserGqlAuthGuard)
    author_admin_find(
        @Args('paginate', { type: () => PaginateDto, nullable: true })
        paginate: PaginateDto
    ): Promise<IPaginate<IAuthorDoc>> {
        return this.authorService.findPaginate(
            (paginate && paginate.offset) || 0,
            (paginate && paginate.limit) || 10
        )
    }


    /**
     * Finds a Author by id (and populate author user (createdBy))
     *
     * -AUTH
     * @param authorId Author ObjectId
     * @returns Author data
     */
    @Query(() => FullAuthor)
    @UseGuards(UserGqlAuthGuard)
    async author_admin_find_by_id(
        @Args('authorId', { type: () => ID }, ObjectIDPipe)
        authorId: ObjectID
    ): Promise<IAuthorDoc<IUserDoc>> {
        const author = await this.authorService.findByIdAndPopulate(authorId);
        if (!author) throw new NotFoundException(AuthorErrors.AUTHOR_NOT_FOUND);
        return author
    }

    //#endregion

    //#region Author

    /**
     * Modifies an axisting course data.
     *
     * - AUTH: User
     * - Roles: Super_Admin
     * @param authorId Author ObjectId
     * @param input True if success
     */
    @Mutation(() => ID)
    //TODO: Probar si funcionar con nest-access-control https://github.com/nestjsx/nest-access-control
    @AllowedUserRoles(UserRoles.SUPER_ADMIN)
    @UseGuards(UserGqlAuthGuard, UserGqlRolesGuard)
    async author_admin_modify(
        @Args('authorId', { type: () => ID }, ObjectIDPipe)
        authorId: ObjectID,
        @Args('input', { type: () => AuthorModifyDto }, AuthorModifyPipe)
        input: AuthorModifyDto
    ): Promise<boolean> {
        await this.authorService.modifyAuthor(authorId, input);
        return true
    }


    /**
     * Remove an existing author.
     * Before delteing a author
     *
     * - AUTH: User
     * - ROLES: Super_admin
     * @param authorId Author ObjectId
     * @return True if success
     */
    @Mutation(() => ID)
    //TODO: Probar si funcionar con nest-access-control https://github.com/nestjsx/nest-access-control
    @AllowedUserRoles(UserRoles.SUPER_ADMIN)
    @UseGuards(UserGqlAuthGuard, UserGqlRolesGuard)
    async author_admin_delete(
        @Args('authorId', { type: () => ID }, ObjectIDPipe)
        authorId: ObjectID
    ): Promise<boolean> {
        await this.authorService.deleteAuthor(authorId)
        return true
    }

    //#endregion
}





