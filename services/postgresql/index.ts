import { exec } from "node:child_process";
import path from "path";
import { Client } from "pg";
import { backupFailures, backupSuccess } from "../../index";
import { dbParams } from "../../models/universal";
import { ensureBackupDirectory } from "../../utils/ensureBackupDirectory";

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

    const backupDir = path.resolve("./backups");
    ensureBackupDirectory(backupDir);

    const outputPath = path.join(
      backupDir,
      `postgres-${database}_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.sql`
    );

    // Construct the pg_dump. pg_dump is a utility for backing up a PostgreSQL database.
    // -f file --file=file. Send output to the specified file.
    // c custom Output a custom-format archive suitable for input into pg_restore.
    // -b --large-objects --blobs (deprecated). Include large objects in the dump. ed. The -b switch is therefore only useful to add large objects to dumps where a specific schema or table has been requested.
    const dumpCommand = `docker exec postgres_db sh -c "PGPASSWORD=${password} pg_dump -U ${user} -F c -b -v ${database}" > ${outputPath}`;

    console.log(`Starting backup for database: ${database}`);

    await new Promise<void>((resolve, reject) => {
      exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
          console.error("Backup failed:", stderr);
          return reject(error);
        }
        console.log("Backup completed successfully:", stdout);
        resolve();
      });
    });

    console.log(`Backup saved at: ${outputPath}`);
    backupSuccess.inc();
    await client.end();
    return outputPath;
  } catch (error: any) {
    console.error("Error during backup:", error);
    backupFailures.inc();
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
    const fileName = `./backups/postgres-sample_2024-11-22T13-54-23-702Z.sql`;

    const restoreCommand = `docker exec postgres_db sh -c 'pg_restore -U ${user} -d ${database} < ${fileName}'`;

    await new Promise<void>((resolve, reject) => {
      exec(restoreCommand, (error, stdout, stderr) => {
        if (error) {
          console.log("Error when restoring db", stderr);
          return reject(error);
        }
        console.log("Successfully restored db", stdout);
        return resolve();
      });
    });

    console.log("Backup restoration done");

    await client.end();
  } catch (error: any) {
    console.error("Error during restoration");
    throw error;
  }
};
