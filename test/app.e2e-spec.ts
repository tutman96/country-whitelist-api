import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

const KNOWN_US_IP = '99.116.181.22';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    
    await app.init();
  });

  describe('POST /validate-ip', () => {
    it('200 - returns valid = true for an ip address in the whitelist', async () => {
      await request(app.getHttpServer())
        .post('/validate-ip')
        .send({ ipAddress: KNOWN_US_IP, countryCodeWhitelist: ['US'] })
        .expect(200)
        .expect({ valid: true, countryCode: 'US' });
    })

    it('200 - returns valid = false for an ip address not in the whitelist', async () => {
      await request(app.getHttpServer())
        .post('/validate-ip')
        .send({ ipAddress: KNOWN_US_IP, countryCodeWhitelist: ['CN'] })
        .expect(200)
        .expect({ valid: false });
    })

    it('400 - returns bad request if ip address is malformed', async () => {
      await request(app.getHttpServer())
        .post('/validate-ip')
        .send({ ipAddress: 'not a real ip', countryCodeWhitelist: ['US'] })
        .expect(400)

      await request(app.getHttpServer())
        .post('/validate-ip')
        .send({ ipAddress: 123, countryCodeWhitelist: ['US'] })
        .expect(400)

      await request(app.getHttpServer())
        .post('/validate-ip')
        .send({ ipAddress: { object: 'yup' }, countryCodeWhitelist: ['US'] })
        .expect(400)
    })

    it('400 - returns bad request if country code whitelist is empty or contains invalid iso countries', async () => {
      await request(app.getHttpServer())
        .post('/validate-ip')
        .send({ ipAddress: KNOWN_US_IP, countryCodeWhitelist: [] })
        .expect(400)

      await request(app.getHttpServer())
        .post('/validate-ip')
        .send({ ipAddress: KNOWN_US_IP, countryCodeWhitelist: ['not an iso country code'] })
        .expect(400)

      await request(app.getHttpServer())
        .post('/validate-ip')
        .send({ ipAddress: KNOWN_US_IP, countryCodeWhitelist: 'not an array' })
        .expect(400)

      await request(app.getHttpServer())
        .post('/validate-ip')
        .send({ ipAddress: KNOWN_US_IP, countryCodeWhitelist: { arrayOfIsoCodes: false } })
        .expect(400)
    })

    it('400 - returns bad request if ip address or country code whitelist is not provided', async () => {
      await request(app.getHttpServer())
        .post('/validate-ip')
        .send({ ipAddress: undefined, countryCodeWhitelist: ['US'] })
        .expect(400)

      await request(app.getHttpServer())
        .post('/validate-ip')
        .send({ ipAddress: KNOWN_US_IP, countryCodeWhitelist: undefined })
        .expect(400)
    })
  });
});
