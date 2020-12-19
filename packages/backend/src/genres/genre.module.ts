import { FileProcessService } from "@Common/utils/file-process.service";
import { imageGenre } from "@Common/utils/file-upload";
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from "@nestjs/platform-express";
import { UserJwtStrategy } from "@Users/auth/user-jwt.strategy";
import { UsersModule } from "@Users/user.module";
import { GenreController } from "./controllers/genre.controller";
import { GenreModels } from "./enums/genre-models.enum";
import { genreProviders } from "./providers/genre.providers";
import { GenreService } from "./services/genre.service";
import { GenreSchema } from "./schemas/genre.schema";



@Module({
    imports: [
        MongooseModule.forFeature([
            {name: GenreModels.GENRE, schema: GenreSchema}
        ]),
        forwardRef(()=> UsersModule),
        MulterModule.register({
            storage: imageGenre
        })
    ],
    providers: [
        ...genreProviders,
        UserJwtStrategy,
        FileProcessService
    ],
    controllers: [GenreController],
    exports:[GenreService]
})

export class GenreModule {}