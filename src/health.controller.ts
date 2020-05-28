import { Controller, Get } from '@nestjs/common';

@Controller('/healthz')
export class HealthController {
	@Get()
	async checkHealth() {
		return true;
	}
}
