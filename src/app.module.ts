
import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { CryptoModule } from "./crypto/crypto.module";
import { AuthModule } from "./auth/auth.module";
import { VaultModule } from "./vault/vault.module";

@Module({
  imports: [PrismaModule, CryptoModule, AuthModule, VaultModule],
})
export class AppModule {}
