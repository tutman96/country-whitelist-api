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
		example: '1.2.3.4'
	})
	@IsIP()
	ipAddress: string;

	@ApiProperty({
		type: 'string',
		isArray: true,
		example: ['US', 'CN']
		// TODO validation against ISO country codes
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsArrayOfValidCountryCodes()
	countryCodeWhitelist: Array<string>;
}

export class ValidationResponse {
	@ApiProperty({
		type: 'boolean',
	})
	valid: boolean;

	@ApiPropertyOptional({
		type: 'string'
	})
	countryCode?: string = null;
}