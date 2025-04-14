import { Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';

@Injectable()
export class TesseractOcrService {
  async parseImage(imageBuffer: Buffer): Promise<{ university: string; id: string; expiryYear: string }> {
    try {
      const worker = await createWorker();

      // Load language and initialize worker
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      const { data: { text } } = await worker.recognize(imageBuffer);
      await worker.terminate();

      // Trích xuất thông tin từ văn bản OCR
      const universityRegex = /(UNIVERSITY OF.*)/i;
      const idRegex = /ID:\s*(\d+)/i;
      const expiryYearRegex = /Expires:.*?(\d{4})\s*-\s*(\d{4})/i;

      const universityMatch = text.match(universityRegex);
      const idMatch = text.match(idRegex);
      const expiryYearMatch = text.match(expiryYearRegex);

      const university = universityMatch ? universityMatch[1].trim() : '';
      const id = idMatch ? idMatch[1].trim() : '';
      const expiryYear = expiryYearMatch ? expiryYearMatch[2].trim() : '';

      return { university, id, expiryYear };
    } catch (error) {
      console.error('Error in Tesseract OCR:', error);
      throw new Error('Failed to process image with OCR');
    }
  }
}