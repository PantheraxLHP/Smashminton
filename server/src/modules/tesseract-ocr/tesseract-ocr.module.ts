import { Module } from '@nestjs/common';
import { TesseractOcrService } from './tesseract-ocr.service';
import { TesseractOcrController } from './tesseract-ocr.controller';

@Module({
  providers: [TesseractOcrService],
  controllers: [TesseractOcrController],
  exports: [TesseractOcrService], // Export service if needed in other modules
})
export class TesseractOcrModule {}
