import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { AwsModule } from './aws/aws.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3, SharedIniFileCredentials } from 'aws-sdk';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: 'ap-northeast-2',
        credentials: new SharedIniFileCredentials({
          profile: 'bara',
        }),
        httpOptions: {
          timeout: 180000,
        },
      },
      services: [S3],
    }),
    ApiModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
