import { ConfigService } from '@nestjs/config';
import { FOLDER_UPLOADS_AUTHORS } from './../../common/utils/file-upload';
import { AuthorModifyDto } from './../dto/author-modify.dto';
import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { promises as fspromises } from 'fs';
import { resolve } from 'path';
import { Env } from '@Common/enums/env.enum';
import { IPaginate, ObjectID } from '@Common/interfaces/mongoose.interface';
import { IUserDoc } from '@Users/interfaces/user-document.interface';
import { IAuthorDoc } from '@Authors/interfaces/author-document.interface';
import { TAuthorModel } from '@Authors/interfaces/author-document.interface';
import { AuthorModels } from '@Authors/enums/author-models.enum';
import { AuthorCreateDto } from '@Authors/dto/author-create.dto';
import { AuthorErrors } from '@Authors/enums/author-errors.enum';



@Injectable()
export class AuthorService {
    constructor(
        @InjectModel(AuthorModels.AUTHOR)
        private readonly authorModel: Model<TAuthorModel>,
        private readonly configService: ConfigService
    ) { }


    //#region Public

    /**
     * Finds all existing authors.
     *
     * @return Author array
     */
    publicFind(): Promise<IAuthorDoc[]> {
        return this.authorModel.find().exec() as Promise<IAuthorDoc[]>;
    }

    /**
     * Find an author by id.
     *
     * @param authorId Author ObjectId
     */
    publicFindById(authorId: ObjectID): Promise<IAuthorDoc | undefined> {
        return this.authorModel
            .findOne({ _id: authorId })
            .exec() as Promise<IAuthorDoc>;
    }

    /**
     * Finds an author by slug and populate User (createdBy)
     *
     * @param authorSlug Author slug
     * @return Author with User (createdBy)
     */
    publicFindBySlugAndPopulate(
        authorSlug: string
    ): Promise<IAuthorDoc<IUserDoc | undefined>> {
        return this.authorModel
            .findOne({ slug: authorSlug })
            .populate('createdBy', '_id name username email')
            .exec() as Promise<IAuthorDoc<IUserDoc>>
    }

    /**
     * Finds some authors by an array of slugs.
     *
     * @param authorsUrls Author urls array
     * @returns Authors array
     */
    publicFindBySlugArray(authorsUrls: string[]): Promise<IAuthorDoc[]> {
        return this.authorModel
            .find({ _id: { $in: [...authorsUrls] } })
            .exec() as Promise<IAuthorDoc[]>;
    }

    //#endregion


    //#region Find

    /**
     * Finds all existing authors (with pagination)
     *
     * @param offset Number of elements to skip
     * @param limit Number of elements to return
     * @return Authors array paginated
     */
    async findPaginate(
        offset: number = 0,
        limit: number = 10
    ): Promise<IPaginate<IAuthorDoc>> {
        return {
            data: (await this.authorModel
                .find()
                .skip(offset)
                .limit(limit)
                .exec()) as IAuthorDoc[],
            limit,
            offset,
            total: await this.authorModel.countDocuments().exec(),
        };
    }

    /**
     * Finds a author by slug.
     * @param authorSlug Author slug
     */
    findBySlug(authorSlug: string): Promise<IAuthorDoc | undefined> {
        return this.authorModel
            .findOne({ slug: authorSlug })
            .exec() as Promise<IAuthorDoc>;
    }


    /**
     * Finds a author by id
     * @param authorId Author ObjectID
     */
    findById(authorId: ObjectID): Promise<IAuthorDoc | undefined> {
        return this.authorModel.findById(authorId).exec() as Promise<IAuthorDoc>;
    }

    /**
     * Finds an author by id and populate all the users (createdBy)
     * @param authorId Author ObjectID
     */
    findByIdAndPopulate(
        authorId: ObjectID
    ): Promise<IAuthorDoc<IUserDoc> | undefined> {
        return this.authorModel
            .findById(authorId).populate('createdBy', '_id username email')
            .exec() as Promise<IAuthorDoc<IUserDoc>>
    }

    /**
     * Finds an author by id and populate all the users (createdBy)
     * @param authorId Author slug
     */
    findBySlugAndPopulate(
        authorSlug: ObjectID
    ): Promise<IAuthorDoc<IUserDoc> | undefined> {
        return this.authorModel
            .findOne({ slug: authorSlug })
            .populate('createdBy', '_id name username email')
            .exec() as Promise<IAuthorDoc<IUserDoc>>
    }

    /**
     * Populated users (createdBy) from a author document
     * @param author Author mongoose document
     */
    populateUsers(author: IAuthorDoc): Promise<IAuthorDoc<IUserDoc>> {
        return (author
            .populate('createdBy')
            .execPopulate() as Partial<IAuthorDoc>) as Promise<IAuthorDoc<IUserDoc>>;
    }

    //#endregion

    //#region Author

    /**
     * Creates a new Author
     * @param authorData Author creation data
     * @param userId New author ObjectId
     */
    async create(authorData: AuthorCreateDto, user: IUserDoc): Promise<ObjectID> {
        const { slug } = authorData;

        const existingAuthor = await this.findBySlug(slug);

        if (existingAuthor) throw new ConflictException(AuthorErrors.AUTHOR_ALREADY_EXISTS);
        const author = await this.authorModel.create({
            ...authorData,
            createdBy: user
        });
        return author._id
    }

    /**
     * Modifiesan existing author data.
     * @param authorId Author ObjectId
     * @param input.name Author new name
     * @param input.slug Author new slug
     * @param input.bio Author new bio
     * @param input.photo Author new photo
     */
    async modifyAuthor(
        authorId: ObjectID,
        { name, slug, bio, photo }: AuthorModifyDto
    ): Promise<ObjectID> {
        const existingAuthor = await this.findById(authorId);

        if (!existingAuthor) throw new NotFoundException(AuthorErrors.AUTHOR_NOT_FOUND);

        if (name) existingAuthor.name = name;
        if (bio) existingAuthor.bio = bio;
        if (photo) existingAuthor.photo = photo;
        if (slug) {
            const existingAuthorBySlug = await this.findBySlug(slug);
            if (existingAuthorBySlug) throw new ConflictException(AuthorErrors.AUTHOR_ALREADY_EXISTS);
            existingAuthor.slug = slug;
        }
        const author = await existingAuthor.save();
        return author._id;
    }


    /**
     * Remove an existing author
     * @param authorId Author ObjectId
     */
    async deleteAuthor(authorId: ObjectID): Promise<void> {
        const existingAuthor = await this.findById(authorId);

        if (!existingAuthor) throw new NotFoundException(AuthorErrors.AUTHOR_NOT_FOUND);

        existingAuthor.remove();
    }

    //#endregion

    //#region Author Images

    /**
     * Sets a new author photo
     * @param authorId Author Object Id
     * @param filename Photo path
     * @returns New photo url
     */
    async setAuthorImage(authorId: ObjectID, filename: string): Promise<string> {
        const author = await this.findById(authorId);
        if (!author) throw new NotFoundException(AuthorErrors.AUTHOR_NOT_FOUND);

        if (author.photo)
            await fspromises
                .unlink(
                    resolve(
                        FOLDER_UPLOADS_AUTHORS,
                        author.photo.replace(
                            this.configService.get(Env.SELF_DOMAIN) +
                            this.configService.get(Env.UPLOADS_STATICS_PATH_AUTHORS) +
                            '/',
                            ''
                        )
                    )
                )
                .catch(error => Logger.error(error));
        author.photo =
            this.configService.get(Env.SELF_DOMAIN) +
            this.configService.get(Env.UPLOADS_STATICS_PATH_AUTHORS) +
            '/' +
            filename;
        await author.save();
        return author.photo;

    }

}