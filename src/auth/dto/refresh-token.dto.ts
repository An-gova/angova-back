import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    refreshToken: string;
}
