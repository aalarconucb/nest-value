
import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SetupDto {
  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  master: string;
}
