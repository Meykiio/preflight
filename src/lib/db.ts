import { PreflightDatabase } from "@/lib/db-schema";
import { initializeDatabaseDefaults } from "@/lib/db-defaults";
import {
  DEFAULT_AGENT_PROMPTS,
  DEFAULT_PLATFORM_LAUNCHERS
} from "@/lib/db-seeds";

// Extend the PreflightDatabase class with the initializeDefaults method
interface PreflightDatabaseWithDefaults extends PreflightDatabase {
  initializeDefaults: () => Promise<void>;
}

const db = new PreflightDatabase() as PreflightDatabaseWithDefaults;

db.initializeDefaults = () => initializeDatabaseDefaults(db);

export default db;
export {
  DEFAULT_AGENT_PROMPTS,
  DEFAULT_PLATFORM_LAUNCHERS,
  initializeDatabaseDefaults,
  PreflightDatabase
};
