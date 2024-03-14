import {Controller, Get, Post} from '@nestjs/common';
import { FixturesService } from './fixtures.service';

@Controller('fixtures')
export class FixturesController {
    constructor(private readonly fixturesService: FixturesService) {}

    @Post('generate')
    async generate(): Promise<string> {
        await this.fixturesService.generateFixtures();
        return 'Fixtures générées avec succès.';
    }
}
