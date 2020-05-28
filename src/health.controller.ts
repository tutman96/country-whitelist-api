import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/healthz')
export class HealthController {
	@ApiOperation({
		summary: 'Health probe'
	})
	@Get()
	async checkHealth() {
		return true;
	}
}
