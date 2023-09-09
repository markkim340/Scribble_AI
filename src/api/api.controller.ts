import { Body, Controller, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { GenerateImagesReqDto } from './dto/api.dto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('generateImage')
  async generateImages(@Body() reqDto: GenerateImagesReqDto): Promise<any> {
    const data = await this.apiService.getStableGenerateImageData(reqDto);
    return data;
  }
}
