import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { GenerateImagesReqDto } from './dto/api.dto';

@Injectable()
export class ApiService {
  private readonly STABLE_API_KEY = process.env.STABLE_API_KEY;
  private readonly reqHeader = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  async getStableGenerateImageData(reqDto: GenerateImagesReqDto): Promise<any> {
    try {
      const reqUrl = 'https://stablediffusionapi.com/api/v3/text2img';
      const reqParam = {
        key: this.STABLE_API_KEY,
        prompt: reqDto.prompt,
        negative_prompt: null,
        width: '512',
        height: '512',
        samples: '4',
        num_inference_steps: '20',
        safety_checker: 'yes',
        enhance_prompt: 'no',
        seed: null,
        guidance_scale: 7.5,
        multi_lingual: 'no',
        panorama: 'no',
        self_attention: 'no',
        upscale: 'no',
        embeddings_model: null,
        webhook: null,
        track_id: null,
      };

      const response = await axios.post(reqUrl, reqParam, this.reqHeader);

      if (response.data.status === 'success') {
        const originalImageUrls = response.data.output;
        const newImageUrls = await this.getReplacementDomain(originalImageUrls);

        return {
          statusCode: 200,
          imageUrls: newImageUrls,
        };
      } else if (response.data.status === 'processing') {
        const reqParams = {
          fetchUrl: response.data.fetch_result,
          eta: response.data.eta,
        };

        const fetchdata = await this.getStableFetchData(reqParams);
        const newImageUrls = await this.getReplacementDomain(fetchdata);
        return {
          statusCode: 200,
          imageUrls: newImageUrls,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getStableFetchData(fetchDto): Promise<any> {
    try {
      const { fetchUrl, eta } = fetchDto;
      const reqBody = {
        key: this.STABLE_API_KEY,
      };

      await new Promise((resolve) => setTimeout(resolve, eta * 1000)); // eta초 만큼 대기 후 요청
      let response = await axios.post(fetchUrl, reqBody, this.reqHeader);
      let count = 0;
      while (response.data.status === 'processing') {
        if (count === 10) {
          throw Error('REPLICATE API Request Count Exceeded, Try again');
        }
        await new Promise((resolve) => setTimeout(resolve, 5000)); // processing일 경우 5초 마다 재요청
        response = await axios.post(fetchUrl, reqBody, this.reqHeader);
        count++;
      }

      if (response.data.status === 'success') {
        return response.data.output;
      } else {
        throw Error('Failed to call Stable Fetch API');
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Stable 한국 cdn 차단으로 Stable에서 알려준 아래의 대체 도메인으로 수정하는 함수
  async getReplacementDomain(urlsArray) {
    const replacementDomain = 'cdn2.stablediffusionapi.com';
    const modifiedUrls = urlsArray.map((url) => {
      const parts = url.split('/generations/');
      if (parts.length === 2) {
        const modifiedUrl = `https://${replacementDomain}/generations/${parts[1]}`;
        return modifiedUrl;
      }
    });
    return modifiedUrls;
  }
}

///To-do
// 2. 리턴 확인
// 3. api 문서 작성
// 4. replicate 로직 처리
// 5. aws translate 이용하기
// 6. 배포 및 테스팅
