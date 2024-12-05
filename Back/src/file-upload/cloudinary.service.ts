import { Injectable } from '@nestjs/common';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    dotenv.config({ path: '.env.development' });
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(buffer: Buffer, folder: string, originalName?: string): Promise<string> {
    const options: UploadApiOptions = {
      folder: folder || 'uploads', // carpeta por defecto o una específica
      public_id: originalName,
      resource_type: 'auto',
    };

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        error ? reject(error) : resolve(result.secure_url);
      });
      toStream(buffer).pipe(stream);
    });
  }

  async getUrl(publicId: string): Promise<string> {
    const result = await cloudinary.api.resource(publicId);
    return result.secure_url;
  }
}
