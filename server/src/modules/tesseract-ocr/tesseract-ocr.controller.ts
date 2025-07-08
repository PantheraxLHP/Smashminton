import { Controller, Post, UploadedFile, UseInterceptors,               BadRequestException, InternalServerErrorException, UploadedFiles } 
        from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { TesseractOcrService } from './tesseract-ocr.service';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('tesseract-ocr')
export class TesseractOcrController {
    constructor(private readonly tesseractOcrService: TesseractOcrService) {}

    @Post('parse')
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
  async parseImage(@UploadedFiles() files: Express.Multer.File[]): Promise<{ results: { university: string; id: string; expiryYear: string }[] }> {
    if (!files || files.length === 0) {
        throw new Error('No files uploaded');
    }

    try {
        // Thực hiện OCR trên tất cả các ảnh
        const results = await Promise.all(
            files.map(async (file) => {
                return await this.tesseractOcrService.parseImage(file.buffer);
            }),
        );

        return { results };
    } catch (error) {
        console.error('Error during OCR processing:', error);
        throw new InternalServerErrorException('Failed to process images with OCR');
    }
}
}