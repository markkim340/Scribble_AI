import { Injectable } from '@nestjs/common';
import { S3UploadReqDto } from './aws.dto';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';

@Injectable()
export class AwsService {
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
      Key: `sketch/${this.getCurrentDate()}${file.originalname}`,
      Body: file.buffer,
    };

    const response = await this.s3.upload(payload).promise();
    return response.Location;
  }

  //현재 연월일시분초 구하는 함수
  getCurrentDate() {
    const date = new Date(); // Data 객체 생성
    const year = date.getFullYear().toString(); // 년도 구하기

    const month = date.getMonth() + 1; // 월 구하기
    const monthStr = month < 10 ? '0' + month.toString() : month.toString(); // 10월 미만 0 추가

    const day = date.getDate(); // 날짜 구하기
    const dayStr = day < 10 ? '0' + day.toString() : day.toString(); // 10일 미만 0 추가

    const hour = date.getHours(); // 시간 구하기
    const hourStr = hour < 10 ? '0' + hour.toString() : hour.toString(); // 10시 미만 0 추가

    const minites = date.getMinutes(); // 분 구하기
    const minitesStr =
      minites < 10 ? '0' + minites.toString() : minites.toString(); // 10분 미만 0 추가

    const seconds = date.getSeconds(); // 초 구하기
    const secondsStr =
      seconds < 10 ? '0' + seconds.toString() : seconds.toString(); // 10초 미만 0 추가

    return year + monthStr + dayStr + hourStr + minitesStr + secondsStr; // yyyymmddhhmmss 형식으로 리턴
  }
}
