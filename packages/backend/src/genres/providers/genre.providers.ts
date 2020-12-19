import { Provider } from '@nestjs/common';
import { GenreResolver } from "@Genres/resolvers/genre.resolver";
import { GenreService } from "@Genres/services/genre.service";



export const genreProviders: Provider[] = [GenreResolver, GenreService];