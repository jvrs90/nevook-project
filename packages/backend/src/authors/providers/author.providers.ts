import { Provider } from '@nestjs/common';
import { AuthorResolver } from "@Authors/resolvers/author.resolver";
import { AuthorService } from "@Authors/services/author.service";



export const authorProviders: Provider[] = [AuthorResolver, AuthorService];