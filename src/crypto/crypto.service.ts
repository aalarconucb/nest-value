
import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { randomBytes, scrypt as _scrypt, createCipheriv, createDecipheriv } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class CryptoService {
  generateSalt(bytes = 16): Buffer {
    return randomBytes(bytes);
  }

  async hashMaster(master: string): Promise<string> {
    // Argon2id para hash de la master password
    return argon2.hash(master, {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 2 ** 15, // ~32MB
      parallelism: 1,
    });
  }

  async verifyMaster(master: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, master);
    } catch {
      return false;
    }
  }

  // async deriveKey(master: string, salt: Buffer): Promise<Buffer> {
  //   // scrypt para derivar una clave simétrica (32 bytes) para AES-256-GCM
  //   const key = (await scrypt(master, salt, 32, { N: 2 ** 15, r: 8, p: 1 })) as Buffer;
  //   return key;
  // }

  async deriveKey(master: string, salt: Buffer): Promise<Buffer> {
    // Deriva 32 bytes para AES-256-GCM usando parámetros por defecto
    const key = (await scrypt(master, salt, 32)) as Buffer;
    return key;
  }


  encrypt(key: Buffer, plaintext: string): { iv: Buffer; tag: Buffer; ciphertext: Buffer } {
    const iv = randomBytes(12); // 96-bit IV recomendado para GCM
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return { iv, tag, ciphertext };
  }

  decrypt(key: Buffer, iv: Buffer, tag: Buffer, ciphertext: Buffer): string {
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plaintext.toString("utf8");
  }
}
