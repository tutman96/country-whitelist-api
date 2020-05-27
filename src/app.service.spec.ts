import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { open } from 'maxmind';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('maxmind');
const mockedMaxmindOpen = open as any as jest.Mock;

describe('AppService', () => {
  let app: TestingModule;
  let getMock: jest.Mock;

  beforeAll(async () => {
    const module = Test.createTestingModule({
      providers: [AppService],
    })

    getMock = jest.fn().mockReturnValue(USLookup);
    mockedMaxmindOpen.mockReturnValue({
      get: getMock
    })

    app = await module.compile();
  });

  beforeEach(() => {
    getMock.mockClear()
  });

  describe('validateIPAddressInOneOfCountry', () => {
    it('should return valid if looked up country is US', async () => {
      const appService = app.get<AppService>(AppService);
      const results = await appService.validateIPAddressInOneOfCountry('8.8.8.8', ['US']);
      expect(results).toEqual(expect.objectContaining({
        valid: true
      }))
    })

    it('should call the maxmind "get" method', async () => {
      const appService = app.get<AppService>(AppService);

      await appService.validateIPAddressInOneOfCountry('8.8.8.8', ['US']);

      expect(getMock).toHaveBeenCalledTimes(1)
      expect(getMock).toHaveBeenLastCalledWith('8.8.8.8')
    })

    it('should throw a 400 error if the ip address could not be looked up', async () => {
      const appService = app.get<AppService>(AppService);
      getMock.mockReturnValueOnce(null);
      
      await expect(appService.validateIPAddressInOneOfCountry('8.8.8.8', ['US'])).rejects.toBeInstanceOf(BadRequestException);
    })

    it('should throw a 404 error if the ip address does not have an associated country', async () => {
      const appService = app.get<AppService>(AppService);
      getMock.mockReturnValueOnce({ ...USLookup, country: undefined, registered_country: undefined });
      
      await expect(appService.validateIPAddressInOneOfCountry('8.8.8.8', ['US'])).rejects.toBeInstanceOf(NotFoundException);
    })
    
    it('should return valid = false if country resolved is not in whitelist', async () => {
      const appService = app.get<AppService>(AppService);
      getMock.mockReturnValueOnce(ChinaLookup);
      
      const response = await appService.validateIPAddressInOneOfCountry('8.8.8.8', ['US']);
      
      expect(response).toEqual(expect.objectContaining({
        valid: false
      }))
    })
    
    it('should return valid = true if country resolved is in whitelist', async () => {
      const appService = app.get<AppService>(AppService);
      getMock.mockReturnValueOnce(USLookup);
      
      const response = await appService.validateIPAddressInOneOfCountry('8.8.8.8', ['US']);
      
      expect(response).toEqual(expect.objectContaining({
        valid: true
      }))
    })
  });
});

/// Mock Responses
const USLookup = {
  continent: {
    code: 'NA',
    geoname_id: 6255149,
    names: {
      de: 'Nordamerika',
      en: 'North America',
      es: 'Norteamérica',
      fr: 'Amérique du Nord',
      ja: '北アメリカ',
      'pt-BR': 'América do Norte',
      ru: 'Северная Америка',
      'zh-CN': '北美洲'
    }
  },
  country: {
    geoname_id: 6252001,
    iso_code: 'US',
    names: {
      de: 'USA',
      en: 'United States',
      es: 'Estados Unidos',
      fr: 'États-Unis',
      ja: 'アメリカ合衆国',
      'pt-BR': 'Estados Unidos',
      ru: 'США',
      'zh-CN': '美国'
    }
  },
  registered_country: {
    geoname_id: 6252001,
    iso_code: 'US',
    names: {
      de: 'USA',
      en: 'United States',
      es: 'Estados Unidos',
      fr: 'États-Unis',
      ja: 'アメリカ合衆国',
      'pt-BR': 'Estados Unidos',
      ru: 'США',
      'zh-CN': '美国'
    }
  }
}

const ChinaLookup = {
  continent: {
    code: 'AS',
    geoname_id: 6255147,
    names: {
      de: 'Asien',
      en: 'Asia',
      es: 'Asia',
      fr: 'Asie',
      ja: 'アジア',
      'pt-BR': 'Ásia',
      ru: 'Азия',
      'zh-CN': '亚洲'
    }
  },
  country: {
    geoname_id: 1814991,
    iso_code: 'CN',
    names: {
      de: 'China',
      en: 'China',
      es: 'China',
      fr: 'Chine',
      ja: '中国',
      'pt-BR': 'China',
      ru: 'Китай',
      'zh-CN': '中国'
    }
  },
  registered_country: {
    geoname_id: 1814991,
    iso_code: 'CN',
    names: {
      de: 'China',
      en: 'China',
      es: 'China',
      fr: 'Chine',
      ja: '中国',
      'pt-BR': 'China',
      ru: 'Китай',
      'zh-CN': '中国'
    }
  }
};
