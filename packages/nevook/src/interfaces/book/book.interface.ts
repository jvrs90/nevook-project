import { Author } from "@Interfaces/author/author.interface";
import { Genre } from "@Interfaces/genre/genre.interface";

export interface PublicBook {
    _id: string;
    title: string;
    slug: string;
    synopsis: string;
    author: string;
    genre: string;
    cover: string;
}