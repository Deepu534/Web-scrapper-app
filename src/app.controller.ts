import { Body, Controller, Post } from '@nestjs/common';
import axios from 'axios';
import { AppService } from './app.service';
import cheerio from 'cheerio';

@Controller('scraper')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async scrapeUrl(@Body() req: any) {
    try {
      const { data } = await axios.get(req.url);
      const $ = cheerio.load(data);
      const response: any = {};
      const title = $('head title').text();
      const desc = $('meta[name="description"]').attr('content');
      const kwd = $('meta[name="keywords"]').attr('content');
      const ogTitle = $('meta[property="og:title"]').attr('content');
      const ogImage = $('meta[property="og:image"]').attr('content');
      const ogkeywords = $('meta[property="og:keywords"]').attr('content');
      const images = $('img');

      if (title) {
        response.title = title;
      }

      if (desc) {
        response.description = desc;
      }

      if (kwd) {
        response.keywords = kwd;
      }

      if (ogImage && ogImage.length) {
        response.ogImage = ogImage;
      }

      if (ogTitle && ogTitle.length) {
        response.ogTitle = ogTitle;
      }

      if (ogkeywords && ogkeywords.length) {
        response.ogkeywords = ogkeywords;
      }

      if (images && images.length) {
        response.images = [];
        for (const image of images) {
          response.images.push(image.attribs.src);
        }
      }
      return response;
    } catch (error) {
      return 'An error has occured';
    }
  }
}
