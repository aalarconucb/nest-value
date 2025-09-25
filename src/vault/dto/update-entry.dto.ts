
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateEntryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false, description: "Nueva contraseña en claro" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  password?: string;

  @ApiProperty({ description: "Master password para derivar la clave de cifrado" })
  @IsString()
  @MinLength(8)
  master: string;
}
