import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ValidationRequest, ValidationResponse } from './app.dto';
import { STATUS_CODES } from 'http';
import { ApiResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('/validate-ip')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ValidationResponse })
  async validateIPAddress(@Body() validationRequest: ValidationRequest) {
    return await this.appService.validateIPAddressInOneOfCountry(
      validationRequest.ipAddress,
      validationRequest.countryCodeWhitelist
    );
  }
}
