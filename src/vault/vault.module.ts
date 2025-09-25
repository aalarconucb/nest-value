
import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CryptoModule } from "../crypto/crypto.module";
import { AuthModule } from "../auth/auth.module";
import { VaultController } from "./vault.controller";
import { VaultService } from "./vault.service";

@Module({
  imports: [PrismaModule, CryptoModule, AuthModule],
  controllers: [VaultController],
  providers: [VaultService],
})
export class VaultModule {}
