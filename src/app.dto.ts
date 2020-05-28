import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsIP, ValidateNested, IsEnum, ValidationOptions, registerDecorator, ValidationArguments, MinLength, IsArray, ArrayNotEmpty } from 'class-validator';
import isoCountryCodes from "./isoCountryCodes";

export function IsArrayOfValidCountryCodes() {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: "isArrayOfValidCountryCodes",
			target: object.constructor,
			propertyName: propertyName,
			validator: {
				validate(value: any, args: ValidationArguments) {
					return Array.isArray(value) && value.every((v) => typeof v === 'string' && isoCountryCodes.includes(v));;
				}
			}
		});
	};
}

export class ValidationRequest {
	@ApiProperty({
		type: 'string',
		description: 'IP address to check the validity of. Can be an IPv4 or IPv6 address',
		example: '1.2.3.4'
	})
	@IsIP()
	ipAddress: string;

	@ApiProperty({
		type: 'string',
		description: 'A list of ISO codes to validate the IP address registration in',
		isArray: true,
		example: ['US', 'CN']
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsArrayOfValidCountryCodes()
	countryCodeWhitelist: Array<string>;
}

export class ValidationResponse {
	@ApiProperty({
		type: 'boolean',
		description: 'Will return true if the IP address provided is registered in a country provided in the whitelist'
	})
	valid: boolean;

	@ApiProperty({
		type: 'string',
		description: 'The ISO code of the country the IP address is registered in'
	})
	countryCode: string;
}