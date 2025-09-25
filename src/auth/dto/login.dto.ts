
import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  master: string;
}
