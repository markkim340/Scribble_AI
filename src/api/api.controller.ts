import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiService } from './api.service';
import {
  BadRequestResDto,
  InternalServerErrorResDto,
  SketchToImageReqDto,
  SketchToImageResDto,
  TextToImageReqDto,
  TextToImageResDto,
} from './dto/api.dto';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api')
@ApiTags('API')
@ApiResponse({
  status: 400,
  description: 'Bad Request',
  type: BadRequestResDto,
})
@ApiResponse({
  status: 500,
  description: 'Server Error',
  type: InternalServerErrorResDto,
})
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('textToImage')
  @ApiOperation({
    summary: '프롬프트를 전달받아 A.I 생성 이미지 리턴',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: TextToImageResDto,
  })
  async generateTextToImages(@Body() reqDto: TextToImageReqDto): Promise<any> {
    const data = await this.apiService.getStableGenerateImageData(reqDto);
    return data;
  }

  @Post('sketchToImage')
  @ApiOperation({
    summary: '프롬프트와 스케치 이미지 파일을 전달받아 A.I 생성 이미지 리턴',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: SketchToImageResDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async generateSketchToImages(
    @Body() reqDto: SketchToImageReqDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const data = await this.apiService.getReplicateScribbleData(reqDto, file);
    return data;
  }
}
