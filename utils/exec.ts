import { exec } from "child_process";
import { dbParams } from "../models/universal";
import path from "path";
import { getTime } from "./startEndTime";
import {
  getBackupDirectory,
  getBackupFile,
  removeBackupDir,
  removeBackupFile,
} from "./backupFiles";
import { ensureBackupDirectory } from "./ensureBackupDirectory";
import { sendMessageToSlack } from "./slackNotification";

export const backupExec = async (
  type: string,
  { host, port, user, password, database }: dbParams
) => {
  let dumpCommand: string, outputPath, uri, backupDir;

  switch (type) {
    case "postgres":
      backupDir = path.resolve("./backups");
      ensureBackupDirectory(backupDir);

      await removeBackupFile(type);

      outputPath = path.join(
        "./backups",
        `postgres-${database}_${new Date()
          .toISOString()
          .replace(/[:.]/g, "-")}.sql.gz`
      );
      dumpCommand = `docker exec postgres_db sh -c "pg_dump -U ${user} ${database} | gzip > ${outputPath}"`;
      break;

    case "mysql":
      backupDir = path.resolve("./backups");
      ensureBackupDirectory(backupDir);

      await removeBackupFile(type);
      outputPath = path.join(
        "./backups",
        `mysql-${database}_${new Date()
          .toISOString()
          .replace(/[:.]/g, "-")}.sql`
      );
      dumpCommand = `docker exec mysql_db sh -c "mysqldump --databases ${database} --port ${port} --user ${user} --password=${password} --host ${host} | gzip " > ${outputPath}.gz`;
      break;

    case "mongo":
      backupDir = path.resolve("./backup");
      ensureBackupDirectory(backupDir);

      await removeBackupDir(type);
      uri = `mongodb://${user}:${password}@${host}:${port}`;
      outputPath = path.join(
        "./backup",
        `mongo-${database}_${new Date().toISOString().replace(/[:.]/g, "-")}`
      );
      dumpCommand = `docker exec mongo_db sh -c "mongodump --uri=${uri}  --port=${port} --username=${user} --password=${password} --authenticationDatabase=admin --db=${database} --gzip --out=${outputPath} "`;
      break;

    default:
      throw new Error("Invalid selection. Please choose a database to backup.");
  }

  // Status Logs
  console.log(`[INFO] Starting ${type} database backup process`);
  const { time: timeStart, timeStartEnd: startTime } = await getTime();
  console.log(`[INFO] Backup start time: ${startTime}`);

  await new Promise<void>((resolve, reject) => {
    exec(dumpCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("Backup failed:", stderr);

        return reject(error);
      }

      console.log(`Backup completed successfully`, stdout);
      return resolve();
    });
  });

  //Status Logs
  const { time: timeEnd, timeStartEnd: endTime } = await getTime();
  console.log(`[INFO] Backup end time: ${endTime}`);
  console.log(`[INFO] Time take: ${timeEnd - timeStart} ms`);

  //Send Slack Notification.
  await sendMessageToSlack(`Successfully backed up ${type} database.`);
};

export const restoreExec = async (
  type: string,
  { host, port, user, password, database }: dbParams
) => {
  let restoreCommand: string, fileName, uri;

  switch (type) {
    case "postgres":
      fileName = await getBackupFile(type);
      restoreCommand = `docker exec postgres_db sh -c 'gunzip -c ${fileName} | psql -U ${user} -d ${database}'`;
      break;

    case "mysql":
      fileName = await getBackupFile(type);
      restoreCommand = `docker exec mysql_db sh -c 'gunzip < ${fileName} | mysql -u ${user} -p${password} ${database}'`;
      break;

    case "mongo":
      fileName = await getBackupDirectory(type);
      uri = `mongodb://${user}:${password}@${host}:${port}`;
      const backupDir = `${fileName}/${database}`;
      restoreCommand = `docker exec mongo_db sh -c "mongorestore --gzip --uri=${uri} --username=${user} --password=${password} --authenticationDatabase=admin --db=${database} ${backupDir}"`;
      break;

    default:
      throw new Error("Invalid selection. Please choose a database to backup.");
  }

  // Status Logs
  console.log(`[INFO] Starting ${type} database restore process`);
  const { time: timeStart, timeStartEnd: startTime } = await getTime();
  console.log(`[INFO] Restore start time: ${startTime}`);

  await new Promise<void>((resolve, reject) => {
    exec(restoreCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("Restore failed:", stderr);

        return reject(error);
      }

      console.log("Restore completed successfully", stdout);
      return resolve();
    });
  });

  //Status Logs
  const { time: timeEnd, timeStartEnd: endTime } = await getTime();
  console.log(`[INFO] Restore end time: ${endTime}`);
  console.log(`[INFO] Time take: ${timeEnd - timeStart} ms`);

  //Send Slack Notification.
  await sendMessageToSlack(`Successfully restored ${type} database.`);
};
