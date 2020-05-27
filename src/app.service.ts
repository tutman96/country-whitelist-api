import { paths } from 'geolite2';
import { open, Reader, CountryResponse } from 'maxmind';
import { ValidationResponse } from './app.dto';
import { NotFoundException, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private static lookup: Promise<Reader<CountryResponse>> = null;
  private get lookup() {
    if (!AppService.lookup) {
      AppService.lookup = open(paths.country);
    }
    return AppService.lookup;
  }

  async validateIPAddressInOneOfCountry(
    ipAddress: string,
    countryWhitelist: Array<string>
  ): Promise<ValidationResponse> {
    const lookup = await this.lookup;
    const ipAddressInformation = lookup.get(ipAddress);
    if (!ipAddressInformation) {
      throw new BadRequestException('IP address information not found for that ip address')
    }
    
    const ipAddressCountry = ipAddressInformation.country || ipAddressInformation.registered_country;
    if (!ipAddressCountry) {
      throw new NotFoundException('The IP address provided does not resolve to any country')
    }
    
    const countryInWhitelist = countryWhitelist.includes(ipAddressCountry.iso_code);
    
    if (!countryInWhitelist) {
      return {
        valid: false
      }
    }
    
    return {
      valid: true,
      countryCode: ipAddressCountry.iso_code
    }
  }
}
