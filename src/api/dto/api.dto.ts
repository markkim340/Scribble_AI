import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TextToImageReqDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '석양이 지는 해변을 가로질러 달리는 말',
    description: '생성하고 싶은 이미지에 대한 내용을 구체적으로 작성',
    required: true,
  })
  prompt: string;
}

export class TextToImageResDto {
  @ApiProperty({
    example: '200',
    description: 'statusCode',
    required: true,
  })
  statusCode: number;

  @ApiProperty({
    example: [
      'https://cdn2.stablediffusionapi.com/generations/2b627f96-53b4-49da-a71d-10ba74b089b0-0.png',
      'https://cdn2.stablediffusionapi.com/generations/2b627f96-53b4-49da-a71d-10ba74b089b0-1.png',
      'https://cdn2.stablediffusionapi.com/generations/2b627f96-53b4-49da-a71d-10ba74b089b0-2.png',
      'https://cdn2.stablediffusionapi.com/generations/2b627f96-53b4-49da-a71d-10ba74b089b0-3.png',
    ],
    description: '생성된 결과 이미지의 URL 배열',
  })
  imageUrls: string[];
}

export class SketchToImageReqDto {
  // @IsNotEmpty()
  // @IsString()
  @ApiProperty({
    example: '장난감 자동차',
    description: '생성하고 싶은 이미지에 대한 내용을 구체적으로 작성',
    required: true,
  })
  prompt: string;

  @IsNotEmpty()
  @ApiProperty({
    type: 'object',
    format: 'binary',
    description: 'User-drawn sketch image file (Blob format)',
    example: {
      fieldname: 'file',
      originalname: 'my_sketch1.png',
      encoding: '7bit',
      mimetype: 'image/png',
      buffer: `<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 02 58 00 00 01 f4 08 06 00 00 00 e1 50 53 d4 00 00 00 01 73 52 47 42 00 ae ce 1c e9 00 00 20 00 ... 23680 more bytes>`,
      size: 23730,
    },
  })
  file: Express.Multer.File;
}

export class SketchToImageResDto {
  @ApiProperty({
    example: '200',
    description: 'statusCode',
    required: true,
  })
  statusCode: number;

  @ApiProperty({
    example: [
      'https://pbxt.replicate.delivery/LPJ7pcXWMJq5P1Z730xTEYqvaoSLPeZfypxuWbHXRJhW3IjRA/output_1.png',
      'https://pbxt.replicate.delivery/8BJr0Bz7QNoZOFuUAepJof1CUINbPdcfum9YVAqfe1x56GZMC/output_2.png',
      'https://pbxt.replicate.delivery/EZXztnMCD55aGdCWiRr3e5FknptGTgO3zmDCZCiO2dzrbkxIA/output_3.png',
      'https://pbxt.replicate.delivery/0IjR66Dd0j5mP9hBRFcZVSYBdAl3xTWcPpK8ARNYpRE2NyYE/output_4.png',
    ],
    description: '생성된 결과 이미지의 URL 배열',
  })
  imageUrls: string[];
}

export class BadRequestResDto {
  @ApiProperty({
    example: ['prompt should not be empty'],
    description: '상세 에러',
  })
  message: string[];
  @ApiProperty({
    example: 'Bad Request',
    description: '에러 메세지',
  })
  error: string;
  @ApiProperty({
    example: '400',
    description: 'statusCode',
  })
  statusCode: number;
}

export class InternalServerErrorResDto {
  @ApiProperty({
    example: 'Failed to call Stable Fetch API',
    description: '상세 에러',
  })
  message: string[];
  @ApiProperty({
    example: 'Internal Server Error',
    description: '에러 메세지',
  })
  error: string;
  @ApiProperty({
    example: '500',
    description: 'statusCode',
  })
  statusCode: number;
}
