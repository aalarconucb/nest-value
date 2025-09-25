
import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SetupDto } from "./dto/setup.dto";
import { LoginDto } from "./dto/login.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("setup")
  setup(@Body() dto: SetupDto) {
    return this.auth.setup(dto.master);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.verify(dto.master);
  }
}
