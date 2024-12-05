import { Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service'; 
import { UploadFileDto } from './dtos/uploadFile.dto';

@Injectable()
export class FileUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(file: UploadFileDto, folder: string): Promise<string> {
    return await this.cloudinaryService.uploadFile(file.buffer, folder, file.originalname);
  }

  async getUrl(publicId: string): Promise<string> {
    return await this.cloudinaryService.getUrl(publicId);
  }
}
