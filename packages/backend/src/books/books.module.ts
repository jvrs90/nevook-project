import { FileProcessService } from "@Common/utils/file-process.service";
import { imageBook } from "@Common/utils/file-upload";
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from "@nestjs/platform-express";
import { UserJwtStrategy } from "@Users/auth/user-jwt.strategy";
import { UsersModule } from "@Users/user.module";
import { BookController } from "./controllers/book.controller";
import { BookModels } from "./enums/book-models.enum";
import { bookProviders } from "./providers/book.providers";
import { BookService } from "./services/book.service";
import { BookSchema } from "./schemas/book.schema";
import { AuthorModule } from "@Authors/author.module";
import { GenreModule } from "@Genres/genre.module";



@Module({
    imports: [
        MongooseModule.forFeature([
            {name: BookModels.BOOK, schema: BookSchema}
        ]),
        forwardRef(()=> UsersModule),
        forwardRef(()=> AuthorModule),
        forwardRef(()=> GenreModule),
        MulterModule.register({
            storage: imageBook
        })
    ],
    providers: [
        ...bookProviders,
        UserJwtStrategy,
        FileProcessService
    ],
    controllers: [BookController],
    exports:[BookService]
})

export class BookModule {}