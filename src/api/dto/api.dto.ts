import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateImagesReqDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;
}
