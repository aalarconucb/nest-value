
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CryptoService } from "../crypto/crypto.service";

@Injectable()
export class VaultService {
  constructor(private prisma: PrismaService, private crypto: CryptoService) {}

  async createEntry(master: string, name: string, username: string | undefined, password: string) {
    const user = await this.prisma.user.findFirst();
    if (!user) throw new Error("Sistema no inicializado");
    const key = await this.crypto.deriveKey(master, user.kdfSalt);
    const { iv, tag, ciphertext } = this.crypto.encrypt(key, password);
    const entry = await this.prisma.entry.create({
      data: {
        name,
        username,
        iv,
        tag,
        ciphertext,
        userId: user.id,
      },
      select: { id: true, name: true, username: true, createdAt: true },
    });
    return entry;
  }

  async listEntries() {
    const user = await this.prisma.user.findFirst();
    if (!user) throw new Error("Sistema no inicializado");
    return this.prisma.entry.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, username: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getEntryDecrypted(id: string, master: string) {
    const user = await this.prisma.user.findFirst();
    if (!user) throw new Error("Sistema no inicializado");
    const entry = await this.prisma.entry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException("Entrada no encontrada");
    const key = await this.crypto.deriveKey(master, user.kdfSalt);
    const plaintext = this.crypto.decrypt(key, entry.iv, entry.tag, entry.ciphertext);
    return {
      id: entry.id,
      name: entry.name,
      username: entry.username,
      password: plaintext,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }

  async updateEntry(id: string, master: string, data: { name?: string; username?: string; password?: string }) {
    const user = await this.prisma.user.findFirst();
    if (!user) throw new Error("Sistema no inicializado");

    let updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.username !== undefined) updateData.username = data.username;

    if (data.password !== undefined) {
      const key = await this.crypto.deriveKey(master, user.kdfSalt);
      const { iv, tag, ciphertext } = this.crypto.encrypt(key, data.password);
      updateData.iv = iv;
      updateData.tag = tag;
      updateData.ciphertext = ciphertext;
    }

    const entry = await this.prisma.entry.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, username: true, updatedAt: true },
    });
    return entry;
  }

  async deleteEntry(id: string) {
    await this.prisma.entry.delete({ where: { id } });
    return { id, deleted: true };
  }
}
