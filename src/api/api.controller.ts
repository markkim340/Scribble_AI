import { Body, Controller, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { SketchToImageReqDto, TextToImageReqDto } from './dto/api.dto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('textToImage')
  async generateTextToImages(@Body() reqDto: TextToImageReqDto): Promise<any> {
    const data = await this.apiService.getStableGenerateImageData(reqDto);
    return data;
  }

  @Post('sketchToImage')
  async generateSketchToImages(
    @Body() reqDto: SketchToImageReqDto,
  ): Promise<any> {
    const data = await this.apiService.getReplicateScribbleData(reqDto);
    return data;
  }
}
