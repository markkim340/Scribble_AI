import { IsNotEmpty, IsString } from 'class-validator';

export class TextToImageReqDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;
}

export class SketchToImageReqDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}
