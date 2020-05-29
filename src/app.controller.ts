import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Logger } from "nestjs-pino";

import { AppService } from './app.service';
import { ValidationRequest, ValidationResponse } from './app.dto';
import { ApiOkResponse, ApiOperation, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@Controller('/validate-ip')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger
  ) { }

  @ApiOperation({
    summary: 'Validate the location of an IP address',
    description: 'Given an IP address and a whitelist of countries, return whether or not that IP address is registered in one of those countries'
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ValidationResponse })
  @ApiBadRequestResponse({ description: 'There was no IP address information found for that IP address' })
  @ApiNotFoundResponse({ description: 'The IP address provided doesn\'t resolve to any country' })
  @Post()
  async validateIPAddress(@Body() validationRequest: ValidationRequest) {
    this.logger.log(`Handling validation request for ${validationRequest.ipAddress} for "${validationRequest.countryCodeWhitelist.join('"')}"`);
    
    const response = await this.appService.validateIPAddressInOneOfCountry(
      validationRequest.ipAddress,
      validationRequest.countryCodeWhitelist
    );
    this.logger.log(`Validation request for ${validationRequest.ipAddress} is registered in ${response.countryCode} and ${response.valid ? 'is' : 'is not'} in the provided whitelist`);
    
    return response;
  }
}
