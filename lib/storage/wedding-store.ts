import { promises as fs } from "fs";
import path from "path";
import { weddingConfig } from "@/data/wedding.config";
import {
  normalizeWeddingConfig,
  needsWeddingDataMigration,
} from "@/lib/helpers/normalizeWeddingConfig";
import { isServerlessReadOnlyFilesystem } from "@/lib/helpers/isServerlessReadOnlyFilesystem";
import type { WeddingConfig } from "@/lib/types/wedding";

const DATA_FILE = path.join(process.cwd(), "data", "wedding-data.json");

const canPersistWeddingData = (): boolean => !isServerlessReadOnlyFilesystem();

const ensureDataFile = async (): Promise<boolean> => {
  if (!canPersistWeddingData()) {
    return false;
  }

  try {
    await fs.access(DATA_FILE);
    return true;
  } catch {
    try {
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(weddingConfig, null, 2), "utf-8");
      return true;
    } catch {
      return false;
    }
  }
};

const readStoredConfig = async (): Promise<Partial<WeddingConfig>> => {
  const canReadPersistedData = await ensureDataFile();

  if (!canReadPersistedData) {
    try {
      const raw = await fs.readFile(DATA_FILE, "utf-8");
      if (raw.trim()) {
        return JSON.parse(raw) as Partial<WeddingConfig>;
      }
    } catch {
      return {};
    }

    return {};
  }

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

  if (needsWeddingDataMigration(stored) && canPersistWeddingData()) {
    await updateWeddingData(normalized);
  }

  return normalized;
};

export const updateWeddingData = async (data: WeddingConfig): Promise<WeddingConfig> => {
  const normalized = normalizeWeddingConfig(data);

  if (!canPersistWeddingData()) {
    throw new Error(
      "Wedding content cannot be saved on this hosting environment. Configure persistent storage or deploy with a writable filesystem."
    );
  }

  const ready = await ensureDataFile();
  if (!ready) {
    throw new Error("Unable to persist wedding content to disk.");
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), "utf-8");
  return normalized;
};

export const resetWeddingData = async (): Promise<WeddingConfig> => {
  await updateWeddingData(weddingConfig);
  return weddingConfig;
};
