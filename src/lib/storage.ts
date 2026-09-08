import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { env } from "./env";

export interface StorageProvider {
  save(userId: string, filename: string, buffer: Buffer): Promise<string>;
  getUrl(userId: string, filename: string): string;
}

export class LocalStorage implements StorageProvider {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(env.UPLOAD_DIR);
  }

  async save(userId: string, filename: string, buffer: Buffer): Promise<string> {
    const userDir = path.join(this.baseDir, userId);
    if (!existsSync(userDir)) {
      await mkdir(userDir, { recursive: true });
    }

    const filePath = path.join(userDir, filename);
    await writeFile(filePath, buffer);
    return this.getUrl(userId, filename);
  }

  getUrl(userId: string, filename: string): string {
    return `/uploads/${userId}/${filename}`;
  }
}

export const storage = new LocalStorage();
