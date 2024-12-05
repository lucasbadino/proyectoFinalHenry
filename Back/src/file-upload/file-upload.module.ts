import { Module, Global } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileUploadService } from './file-upload.service';

@Global() 
@Module({
  providers: [CloudinaryService, FileUploadService],
  exports: [FileUploadService, CloudinaryService], 
})
export class FileUploadModule {}
