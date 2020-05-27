import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BadRequestException } from '@nestjs/common';

describe('AppController', () => {
  let app: TestingModule;
  let serviceMock = {
    validateIPAddressInOneOfCountry: jest.fn().mockReturnValue({ valid: true })
  };

  beforeEach(async () => {
    const module = Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    })

    // Mock the AppService
    serviceMock.validateIPAddressInOneOfCountry.mockClear();
    module.overrideProvider(AppService).useValue(serviceMock)

    app = await module.compile();
  });

  describe('validateIPAddress', () => {
    it('should return the results of AppService.validateIPAddressInOneOfCountry', async () => {
      const appController = app.get<AppController>(AppController);

      const response = await appController.validateIPAddress({
        ipAddress: '8.8.8.8',
        countryCodeWhitelist: []
      })

      expect(response).toEqual({
        valid: true
      });
    });

    it('should call AppService.validateIPAddressInOneOfCountry with the ip address and whitelist', async () => {
      const appController = app.get<AppController>(AppController);

      await appController.validateIPAddress({
        ipAddress: '8.8.8.8',
        countryCodeWhitelist: []
      })

      expect(serviceMock.validateIPAddressInOneOfCountry).toHaveBeenCalledTimes(1);
      expect(serviceMock.validateIPAddressInOneOfCountry).toHaveBeenLastCalledWith('8.8.8.8', []);
    });

    it('should throw an error when the AppService.validateIPAddressInOneOfCountry throws an error', async () => {
      const appController = app.get<AppController>(AppController);
      serviceMock.validateIPAddressInOneOfCountry.mockRejectedValueOnce(new BadRequestException('Bad request'));

      await expect(appController.validateIPAddress({
        ipAddress: '8.8.8.8',
        countryCodeWhitelist: []
      })).rejects.toBeInstanceOf(BadRequestException);
    })
  });
});
