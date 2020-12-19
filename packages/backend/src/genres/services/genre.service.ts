import { ConfigService } from '@nestjs/config';
import { FOLDER_UPLOADS_GENRES } from './../../common/utils/file-upload';
import { GenreModifyDto } from './../dto/genre-modify.dto';
import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Model } from 'mongoose';
import { promises as fspromises } from 'fs';
import { resolve } from 'path';
import { Env } from '@Common/enums/env.enum';
import { IPaginate, ObjectID } from '@Common/interfaces/mongoose.interface';
import { IUserDoc } from '@Users/interfaces/user-document.interface';
import { IGenreDoc } from '@Genres/interfaces/genre-document.interface';
import { TGenreModel } from '@Genres/interfaces/genre-document.interface';
import { GenreModels } from '@Genres/enums/genre-models.enum';
import { GenreCreateDto } from '@Genres/dto/genre-create.dto';
import { GenreErrors } from '@Genres/enums/genre-errors.enum';



@Injectable()
export class GenreService {
    constructor(
        @InjectModel(GenreModels.GENRE)
        private readonly genreModel: Model<TGenreModel>,
        private readonly configService: ConfigService
    ) { }


    //#region Public

    /**
     * Finds all existing genres.
     *
     * @return Genre array
     */
    publicFind(): Promise<IGenreDoc[]> {
        return this.genreModel.find().exec() as Promise<IGenreDoc[]>;
    }

    /**
     * Find an genre by id.
     *
     * @param genreId Genre ObjectId
     */
    publicFindById(genreId: ObjectID): Promise<IGenreDoc | undefined> {
        return this.genreModel
            .findOne({ _id: genreId })
            .exec() as Promise<IGenreDoc>;
    }

    /**
     * Finds an genre by slug and populate User (createdBy)
     *
     * @param genreSlug Genre slug
     * @return Genre with User (createdBy)
     */
    publicFindBySlugAndPopulate(
        genreSlug: string
    ): Promise<IGenreDoc<IUserDoc | undefined>> {
        return this.genreModel
            .findOne({ slug: genreSlug })
            .populate('createdBy', '_id name username email')
            .exec() as Promise<IGenreDoc<IUserDoc>>
    }

    /**
     * Finds some genres by an array of slugs.
     * Only returns genres whose visibility is public.
     * @param genresUrls Genre urls array
     * @returns Genres array
     */
    publicFindBySlugArray(genresUrls: string[]): Promise<IGenreDoc[]> {
        return this.genreModel
            .find({ _id: { $in: [...genresUrls] }, visibility: true })
            .exec() as Promise<IGenreDoc[]>;
    }

    //#endregion


    //#region Find

    /**
     * Finds all existing genres (with pagination)
     * @param offset Number of elements to skip
     * @param limit Number of elements to return
     * @return Genres array paginated
     */
    async findPaginate(
        offset: number = 0,
        limit: number = 10
    ): Promise<IPaginate<IGenreDoc>> {
        return {
            data: (await this.genreModel
                .find()
                .skip(offset)
                .limit(limit)
                .exec()) as IGenreDoc[],
            limit,
            offset,
            total: await this.genreModel.countDocuments().exec(),
        };
    }

    /**
     * Finds a genre by slug.
     * @param genreSlug Genre slug
     */
    findBySlug(genreSlug: string): Promise<IGenreDoc | undefined> {
        return this.genreModel
            .findOne({ slug: genreSlug })
            .exec() as Promise<IGenreDoc>;
    }


    /**
     * Finds a genre by id
     * @param genreId Genre ObjectID
     */
    findById(genreId: ObjectID): Promise<IGenreDoc | undefined> {
        return this.genreModel.findById(genreId).exec() as Promise<IGenreDoc>;
    }

    /**
     * Finds an genre by id and populate all the users (createdBy)
     * @param genreId Genre ObjectID
     */
    findByIdAndPopulate(
        genreId: ObjectID
    ): Promise<IGenreDoc<IUserDoc> | undefined> {
        return this.genreModel
            .findById(genreId).populate('createdBy', '_id username email')
            .exec() as Promise<IGenreDoc<IUserDoc>>
    }

    /**
     * Finds an genre by id and populate all the users (createdBy)
     * @param genreId Genre slug
     */
    findBySlugAndPopulate(
        genreSlug: ObjectID
    ): Promise<IGenreDoc<IUserDoc> | undefined> {
        return this.genreModel
            .findOne({ slug: genreSlug })
            .populate('createdBy', '_id name username email')
            .exec() as Promise<IGenreDoc<IUserDoc>>
    }

    /**
     * Populated users (createdBy) from a genre document
     * @param genre Genre mongoose document
     */
    populateUsers(genre: IGenreDoc): Promise<IGenreDoc<IUserDoc>> {
        return (genre
            .populate('createdBy')
            .execPopulate() as Partial<IGenreDoc>) as Promise<IGenreDoc<IUserDoc>>;
    }

    //#endregion

    //#region Genre

    /**
     * Creates a new Genre
     * @param genreData Genre creation data
     * @param userId New genre ObjectId
     */
    async create(genreData: GenreCreateDto, user: IUserDoc): Promise<ObjectID> {
        const { slug } = genreData;

        const existingGenre = await this.findBySlug(slug);

        if (existingGenre) throw new ConflictException(GenreErrors.GENRE_ALREADY_EXISTS);
        const genre = await this.genreModel.create({
            ...genreData,
            createdBy: user
        });
        return genre._id
    }

    /**
     * Modifiesan existing genre data.
     * @param genreId Genre ObjectId
     * @param input.name Genre new name
     * @param input.slug Genre new slug
     * @param input.bio Genre new bio
     * @param input.photo Genre new photo
     */
    async modifyGenre(
        genreId: ObjectID,
        { name, slug, photo }: GenreModifyDto
    ): Promise<ObjectID> {
        const existingGenre = await this.findById(genreId);

        if (!existingGenre) throw new NotFoundException(GenreErrors.GENRE_NOT_FOUND);

        if (name) existingGenre.name = name;
        if (photo) existingGenre.photo = photo;
        if (slug) {
            const existingGenreBySlug = this.findBySlug(slug);
            if (existingGenreBySlug) throw new ConflictException(GenreErrors.GENRE_ALREADY_EXISTS);
            existingGenre.slug = slug;
        }
        const genre = await existingGenre.save();
        return genre._id;
    }


    /**
     * Remove an existing course
     * @param genreId Genre ObjectId
     */
    async deleteGenre(genreId: ObjectID): Promise<void> {
        const existingGenre = await this.findById(genreId);

        if (!existingGenre) throw new NotFoundException(GenreErrors.GENRE_NOT_FOUND);

        existingGenre.remove();
    }

    //#endregion

    //#region Genre Images

    /**
     * Sets a new genre photo
     * @param genreId Genre Object Id
     * @param filename Photo path
     * @returns New photo url
     */
    async setGenreImage(genreId: ObjectID, filename: string): Promise<string> {
        const genre = await this.findById(genreId);
        if (!genre) throw new NotFoundException(GenreErrors.GENRE_NOT_FOUND);

        if (genre.photo)
            await fspromises
                .unlink(
                    resolve(
                        FOLDER_UPLOADS_GENRES,
                        genre.photo.replace(
                            this.configService.get(Env.SELF_DOMAIN) +
                            this.configService.get(Env.UPLOADS_STATICS_PATH_GENRES) +
                            '/',
                            ''
                        )
                    )
                )
                .catch(error => Logger.error(error));
        genre.photo =
            this.configService.get(Env.SELF_DOMAIN) +
            this.configService.get(Env.UPLOADS_STATICS_PATH_GENRES) +
            '/' +
            filename;
        await genre.save();
        return genre.photo;

    }

}