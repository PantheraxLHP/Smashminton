import { Module } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    controllers: [CourtsController],
    providers: [CourtsService],
    imports: [PrismaModule, CloudinaryModule],
    exports: [CourtsService],
})
export class CourtsModule { }
