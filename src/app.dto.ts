import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ValidationRequest {
	@ApiProperty({
		type: 'string'
		// TODO validation against ip addresses
	})
	ipAddress: string;
	
	@ApiProperty({
		type: 'string',
		isArray: true
		// TODO validation against ISO country codes
	})
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