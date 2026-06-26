import { promises as fs } from "fs";
import path from "path";
import { weddingConfig } from "@/data/wedding.config";
import { normalizeWeddingConfig, needsWeddingDataMigration } from "@/lib/helpers/normalizeWeddingConfig";
import type { WeddingConfig } from "@/lib/types/wedding";

const DATA_FILE = path.join(process.cwd(), "data", "wedding-data.json");

const ensureDataFile = async (): Promise<void> => {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(weddingConfig, null, 2), "utf-8");
  }
};

const readStoredConfig = async (): Promise<Partial<WeddingConfig>> => {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8").catch(() => "");

  if (!raw.trim()) {
    return {};
  }

  try {
    return JSON.parse(raw) as Partial<WeddingConfig>;
  } catch {
    return {};
  }
};

export const getWeddingData = async (): Promise<WeddingConfig> => {
  const stored = await readStoredConfig();
  const normalized = normalizeWeddingConfig(stored);

  if (needsWeddingDataMigration(stored)) {
    await updateWeddingData(normalized);
  }

  return normalized;
};

export const updateWeddingData = async (data: WeddingConfig): Promise<WeddingConfig> => {
  const normalized = normalizeWeddingConfig(data);
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), "utf-8");
  return normalized;
};

export const resetWeddingData = async (): Promise<WeddingConfig> => {
  await updateWeddingData(weddingConfig);
  return weddingConfig;
};
