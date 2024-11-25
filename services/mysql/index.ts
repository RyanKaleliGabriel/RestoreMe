import mysql from "mysql2/promise";
import { exec } from "node:child_process";
import path from "path";
import { dbParams } from "../../models/universal";
import { ensureBackupDirectory } from "../../utils/ensureBackupDirectory";
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
    // The path.resolve() method resolves a sequence of paths or path segments into an absolute path.
    // Absolute path: /home/user/documents/report.pdf. specifies the location of a file or directory starting from the root of the file system or domain.
    // Relative path: documents/report.pdf. specifies the location of a file or directory relative to the current working directory or the current resource's location.
    //
    const backupDir = path.resolve("./backups");
    ensureBackupDirectory(backupDir);

    // The path.join() method joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
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

export const mysqlRestore = async ({
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
    console.log(`Connected to MYSQL!: ${database}`);


    const filename = "./backups/mysql-sample_2024-11-22T14-01-40-531Z.sql";

    const restoreCommand = `docker exec mysql_db sh -c 'mysql -u ${user} -p${password} ${database}  < ${filename}'`;

    await new Promise<void>((resolve, reject) => {
      exec(restoreCommand, (error, stdout, stderr) => {
        if (error) {
          console.error("Backup restore failed:", stderr);
          return reject(error);
        }

        console.log("Backup restore completed successfully", stdout);
        return resolve();
      });
    });

    await conncetion.end();
  } catch (error: any) {
    console.error("Error during restoring", error);
    throw error;
  }
};
