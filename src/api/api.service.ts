import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { SketchToImageReqDto, TextToImageReqDto } from './dto/api.dto';
import Replicate from 'replicate';
import { translate } from 'bing-translate-api';

@Injectable()
export class ApiService {
  private readonly STABLE_API_KEY = process.env.STABLE_API_KEY;
  private readonly REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
  private readonly reqHeader = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  async getStableGenerateImageData(reqDto: TextToImageReqDto): Promise<any> {
    try {
      let newPrompt: string;
      await translate(reqDto.prompt, null, 'en')
        .then((res) => {
          newPrompt = res.translation;
        })
        .catch((err) => {
          throw Error(err);
        });

      const reqUrl = 'https://stablediffusionapi.com/api/v3/text2img';
      const reqParam = {
        key: this.STABLE_API_KEY,
        prompt: newPrompt,
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
        const newImageUrls = await this.replaceStableDomain(originalImageUrls);

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
        const newImageUrls = await this.replaceStableDomain(fetchdata);
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
  async replaceStableDomain(urlsArray) {
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

  async getReplicateScribbleData(reqDto: SketchToImageReqDto): Promise<any> {
    try {
      const { prompt, image } = reqDto;
      let newPrompt: string;
      await translate(prompt, null, 'en')
        .then((res) => {
          newPrompt = res.translation;
        })
        .catch((err) => {
          throw Error(err);
        });

      const replicate = new Replicate({ auth: this.REPLICATE_API_TOKEN });
      const output: any = await replicate.run(
        'jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117',
        {
          input: {
            image: image,
            prompt: newPrompt,
            num_samples: '4',
          },
        },
      );

      const imageUrls: string[] = output.slice(1);

      return {
        statusCode: 200,
        imageUrls: imageUrls,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

///To-do
// 2. 리턴 확인
// 3. api 문서 작성
// 6. 배포 및 테스팅
