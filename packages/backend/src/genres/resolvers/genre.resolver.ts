import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    Genre,
    GenrePaginated,
    FullGenre,
} from '@Genres/types/genre.type';
import { IGenreDoc } from '@Genres/interfaces/genre-document.interface';
import { GenreErrors } from '@Genres/enums/genre-errors.enum';
import { GenreModifyDto } from '@Genres/dto/genre-modify.dto';
import { GenreService } from '@Genres/services/genre.service';
import { IPaginate } from '@Common/interfaces/mongoose.interface';
import { ObjectIDPipe } from '@Common/pipes/objectid.pipe';
import { ObjectIDArrayPipe } from '@Common/pipes/objectid-array.pipe';
import { ObjectID } from '@Common/interfaces/mongoose.interface';
import { PaginateDto } from '@Common/types/paginate-filter.types';
import { IUserDoc } from '@Users/interfaces/user-document.interface';
import { Auth } from '@Users/auth/auth.decorator';
import { UserGqlAuthGuard } from '@Users/auth/user-gql-auth.guard';
import { AppResource } from '@Users/enums/user-roles.enum';
import { GenreCreateDto } from '@Genres/dto/genre-create.dto';
import { GenreCreatePipe } from '@Genres/pipes/genre-create.pipe';
import { GenreModifyPipe } from '@Genres/pipes/genre-modify.pipe';
import { GetGqlAuthUser } from '@Common/auth/get-user.decorator';




@Resolver(() => Genre)
export class GenreResolver {

    /**
     * Dependecy injection
     * @param genreService Genre service
     */
    constructor(private readonly genreService: GenreService) { }

    //#region Public

    /**
     * Finds all existing genres.
     *
     * - AUTH Public
     * @return Genres aray
     */
    @Query(() => [Genre])
    genre_public_find(): Promise<IGenreDoc[]> {
        return this.genreService.publicFind();
    }


    /**
     * Finds some genre by an array of slugs
     *
     * - AUTH: Public
     * @param genreSlugs Genre slugs array
     * @return Genre data array
     */
    @Query(() => [Genre])
    genre_public_find_by_slug_array(
        @Args('genreSlugs', { type: () => [String]! }, ObjectIDArrayPipe)
        genreSlugs: ObjectID[]
    ): Promise<IGenreDoc[]> {
        return this.genreService.publicFindBySlugArray(genreSlugs);
    }

    //#endregion


    //#region Find

    /**
     * Finds all existing genres (with pagination)
     *
     * - AUTH
     * @param paginate Pagination options
     * @returns Pagination with genres array
     */
    @Query(() => GenrePaginated)
    @UseGuards(UserGqlAuthGuard)
    genre_admin_find(
        @Args('paginate', { type: () => PaginateDto, nullable: true })
        paginate: PaginateDto
    ): Promise<IPaginate<IGenreDoc>> {
        return this.genreService.findPaginate(
            (paginate && paginate.offset) || 0,
            (paginate && paginate.limit) || 10
        )
    }


    /**
     * Finds a Genre by id (and populate genre user (createdBy))
     *
     * -AUTH
     * @param genreId Genre ObjectId
     * @returns Genre data
     */
    @Query(() => FullGenre)
    // @UseGuards(UserGqlAuthGuard)
    async genre_admin_find_by_id(
        @Args('genreId', { type: () => ID }, ObjectIDPipe)
        genreId: ObjectID
    ): Promise<IGenreDoc<IUserDoc>> {
        const genre = await this.genreService.findByIdAndPopulate(genreId);
        if (!genre) throw new NotFoundException(GenreErrors.GENRE_NOT_FOUND);
        return genre
    }

    //#endregion

    //#region Genre

    /**
     * Creates a new genre.
     *
     * - AUTH: Users
     * - ROLES: ADMIN | SUPER_ADMIN
     * @param genreData Genre creation data
     * @returns Genre object id
     */
    @Mutation(() => ID)
    @Auth({action: 'create', possession:'any', resource: AppResource.GENRE })
    async genre_admin_create(
        @Args('genreData', { type: () => GenreCreateDto }, GenreCreatePipe)
        genreData: GenreCreateDto,
        @GetGqlAuthUser() user: IUserDoc
    ): Promise<ObjectID> {
        //TODO: averiguar como obtener el usuario logueado
        return this.genreService.create(genreData, user);
    }

    /**
     * Modifies an axisting genre data.
     *
     * - AUTH: User
     * - Roles: ADMIN | SUPER_ADMIN
     * @param genreId Genre ObjectId
     * @param input True if success
     */
    @Mutation(() => ID)
    @Auth({action: 'update', possession:'any', resource: AppResource.GENRE })
    async genre_admin_modify(
        @Args('genreId', { type: () => ID }, ObjectIDPipe)
        genreId: ObjectID,
        @Args('input', { type: () => GenreModifyDto }, GenreModifyPipe)
        input: GenreModifyDto
    ): Promise<ObjectID> {
        return await this.genreService.modifyGenre(genreId, input);
    }

    /**
     * Remove an existing genre.
     * Before delteing a genre
     *
     * - AUTH: User
     * - ROLES: Super_admin
     * @param genreId Genre ObjectId
     * @return True if success
     */
    @Mutation(() => ID)
    @Auth({action: 'delete', possession:'any', resource: AppResource.GENRE })
    async genre_admin_delete(
        @Args('genreId', { type: () => ID }, ObjectIDPipe)
        genreId: ObjectID
    ): Promise<boolean> {
        await this.genreService.deleteGenre(genreId)
        return true
    }

    //#endregion
}





