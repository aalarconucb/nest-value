
import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CryptoService } from "../crypto/crypto.service";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private crypto: CryptoService) {}

  async setup(master: string) {
    const existing = await this.prisma.user.findFirst();
    if (existing) {
      throw new ConflictException("El sistema ya fue inicializado.");
    }
    const masterHash = await this.crypto.hashMaster(master);
    const kdfSalt = this.crypto.generateSalt(16);
    const user = await this.prisma.user.create({
      data: { masterHash, kdfSalt },
    });
    return { message: "Inicialización completada", userId: user.id };
  }

  async verify(master: string) {
    const user = await this.prisma.user.findFirst();
    if (!user) throw new UnauthorizedException("El sistema no está inicializado.");
    const ok = await this.crypto.verifyMaster(master, user.masterHash);
    if (!ok) throw new UnauthorizedException("Master password inválida.");
    return { ok: true };
  }

  async getVaultKey(master: string): Promise<Buffer> {
    const user = await this.prisma.user.findFirst();
    if (!user) throw new UnauthorizedException("El sistema no está inicializado.");
    const ok = await this.crypto.verifyMaster(master, user.masterHash);
    if (!ok) throw new UnauthorizedException("Master password inválida.");
    const key = await this.crypto.deriveKey(master, user.kdfSalt);
    return key;
  }
}
