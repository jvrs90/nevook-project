import { FileProcessService } from "@Common/utils/file-process.service";
import { imageAuthor } from "@Common/utils/file-upload";
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from "@nestjs/platform-express";
import { UserJwtStrategy } from "@Users/auth/user-jwt.strategy";
import { UsersModule } from "@Users/user.module";
import { AuthorController } from "./controllers/author.controller";
import { AuthorModels } from "./enums/author-models.enum";
import { authorProviders } from "./providers/author.providers";
import { AuthorService } from "./services/author.service";
import { AuthorSchema } from "./shcemas/author.schema";



@Module({
    imports: [
        MongooseModule.forFeature([
            {name: AuthorModels.AUTHOR, schema: AuthorSchema}
        ]),
        forwardRef(()=> UsersModule),
        MulterModule.register({
            storage: imageAuthor
        })
    ],
    providers: [
        ...authorProviders,
        UserJwtStrategy,
        FileProcessService
    ],
    controllers: [AuthorController],
    exports:[AuthorService]
})

export class AuthorModule {}