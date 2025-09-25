
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateEntryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: "Contraseña en texto claro (será cifrada)" })
  @IsString()
  @MinLength(1)
  password: string;

  @ApiProperty({ description: "Master password para derivar la clave de cifrado" })
  @IsString()
  @MinLength(8)
  master: string;
}
