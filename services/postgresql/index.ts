import { Client } from "pg";
import { dbParams } from "../../models/universal";
import { backupExec, restoreExec } from "../../utils/exec";

// 1. Connect to the database.
// 2. Export data
// 3. Saved the exported data to a local file
export const postgresBackup = async ({
  host,
  port,
  user,
  password,
  database,
}: dbParams) => {
  try {
    const client = new Client({
      host,
      port,
      user,
      password,
      database,
    });

    await client.connect();
    console.log(`Connected to postgreSQL!`);

    await backupExec("postgres", {
      host,
      port,
      user,
      password,
      database,
    });

    await client.end();
  } catch (error: any) {
    console.error("Error during backup:", error);
    throw error;
  }
};

export const postgresRestore = async ({
  host,
  port,
  user,
  password,
  database,
}: dbParams) => {
  try {
    const client = new Client({
      host,
      port,
      user,
      password,
      database,
    });
    await client.connect();
    console.log(`Connected to postgres db: ${database}`);

    await restoreExec("postgres", {
      host,
      port,
      user,
      password,
      database,
    });

    await client.end();
  } catch (error: any) {
    console.error("Error during restoration");
    throw error;
  }
};
