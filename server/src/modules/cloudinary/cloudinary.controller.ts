import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
@Controller('image')
@ApiTags('Cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @Public() // Đánh dấu route này là public
  @UseInterceptors(
    FilesInterceptor('file[]', 2, {
      limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file: 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data') // Định nghĩa loại dữ liệu là multipart/form-data
  @ApiBody({
    description: 'Upload multiple images',
    schema: {
      type: 'object',
      properties: {
        'file[]': {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary', // Định nghĩa file upload
          },
        },
      },
    },
  })
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    console.log('Uploaded files:', files); // Debug thông tin file upload
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }
  
    try {
      const results = await Promise.all(
        files.map((file) => this.cloudinaryService.uploadFiles(file)),
      );
      return { urls: results.map((result: { secure_url: string }) => result.secure_url) };
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    
    }
  }
}