import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

describe('AppController', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue(AppService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('POST /users', function () {
    it('responds with json', async () => {
      const resObj = {
        title: 'Google',
        images: [
          '/images/branding/googlelogo/1x/googlelogo_white_background_color_272x92dp.png',
        ],
      };
      const req = {
        url: 'https://www.google.com/',
      };
      const response = await request(app.getHttpServer())
        .post('/scraper')
        .send(req);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(resObj);
    });

    it('returns An error has occured in case of error', async () => {
      const req = {
        url: 'https://www.google',
      };
      const response = await request(app.getHttpServer())
        .post('/scraper')
        .send(req);
      expect(response.text).toEqual('An error has occured');
    });
  });
});
