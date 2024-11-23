import { dbParams } from "../../models/universal";
import mysql from "mysql2/promise";
import { ensureBackupDirectory } from "../../utils/ensureBackupDirectory";
import path from "path";
import { exec } from "node:child_process";
// 1. Connect to the db
// 2. Export the file
// 3. Save th exported data to a file

export const mysqlBackup = async ({
  host,
  port,
  user,
  password,
  database,
}: dbParams) => {
  try {
    const conncetion = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
    });

    console.log("Connected to MYSQL!");
    const backupDir = path.resolve("./backups");
    ensureBackupDirectory(backupDir);

    const outputPath = path.join(
      backupDir,
      `mysql-${database}_${new Date().toISOString().replace(/[:.]/g, "-")}.sql`
    );

    const dumpCommand = `docker exec mysql_db sh -c "mysqldump --databases ${database} --port ${port} --user ${user} --password=${password} --host ${host}" > ${outputPath}`;

    console.log(`Starting backup for mysql db: ${database}`);

    await new Promise<void>((resolve, reject) => {
      exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
          console.error("Backup failed:", stderr);
          return reject(error);
        }

        console.log("Backup completed successfully", stdout);
        return resolve();
      });
    });
    await conncetion.end();
  } catch (error: any) {
    console.error("Error during backup", error);
    throw error;
  }
};
