import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadFiles(file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is undefined');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'StudentCards' }, // Thư mục trên Cloudinary
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );

      // Tạo stream từ buffer và pipe vào Cloudinary
      const readableStream = new Readable();
      readableStream.push(file.buffer); // Sử dụng buffer từ Multer
      readableStream.push(null); // Kết thúc stream
      readableStream.pipe(uploadStream);
    });
  }
  async uploadAvatar(file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new Error('File is undefined');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'Avatars' }, // Thư mục trên Cloudinary
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );

      // Tạo stream từ buffer và pipe vào Cloudinary
      const readableStream = new Readable();
      readableStream.push(file.buffer); // Sử dụng buffer từ Multer
      readableStream.push(null); // Kết thúc stream
      readableStream.pipe(uploadStream);
    });
  }

  async uploadZoneImg(file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new Error('File is undefined');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'Zones' }, // Thư mục trên Cloudinary
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );

      // Tạo stream từ buffer và pipe vào Cloudinary
      const readableStream = new Readable();
      readableStream.push(file.buffer); // Sử dụng buffer từ Multer
      readableStream.push(null); // Kết thúc stream
      readableStream.pipe(uploadStream);
    });
  }

  async uploadCourtImg(file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new Error('File is undefined');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'Courts' }, // Thư mục trên Cloudinary
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );

      // Tạo stream từ buffer và pipe vào Cloudinary
      const readableStream = new Readable();
      readableStream.push(file.buffer); // Sử dụng buffer từ Multer
      readableStream.push(null); // Kết thúc stream
      readableStream.pipe(uploadStream);
    });
  }
}