import { Injectable, Logger } from '@nestjs/common';
import { S3UploadReqDto } from './aws.dto';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';

@Injectable()
export class AwsService {
  private readonly logger: Logger;

  constructor(@InjectAwsService(S3) private readonly s3: S3) {}

  /**
   * 유저가 사용하고자 하는 스케치 업로드
   * @param file 파일
   * @returns 업로드된 URL
   */

  public async s3UploadToSketchImages(
    file: Express.Multer.File,
  ): Promise<string> {
    const payload: S3UploadReqDto = {
      Bucket: 'bara-images',
      Key: `Sketch_images/${file.originalname}`,
      Body: file.buffer,
    };

    const response = await this.s3.upload(payload).promise();
    this.logger.log(
      'info',
      `s3Upload to user's sketch response : ${JSON.stringify(
        response,
        null,
        2,
      )}`,
    );

    return response.Location;
  }
}
