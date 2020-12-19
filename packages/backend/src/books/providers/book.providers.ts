import { Provider } from '@nestjs/common';
import { BookResolver } from "@Books/resolvers/book.resolver";
import { BookService } from "@Books/services/book.service";



export const bookProviders: Provider[] = [BookResolver, BookService];