import { exec } from "child_process";
import { MongoClient } from "mongodb";
import path from "path";
import { dbParams } from "../../models/universal";
import { ensureBackupDirectory } from "../../utils/ensureBackupDirectory";
import { backupFailures, backupSuccess } from "../..";

export const mongoDbBackup = async ({
  host,
  port,
  user,
  password,
  database,
}: dbParams) => {
  try {
    const uri = `mongodb://${user}:${password}@${host}:${port}`;
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB!");
    const backupDir = path.resolve("./backups");
    ensureBackupDirectory(backupDir);

    // Define the output path for the backup (directory where the database dump will be saved)
    const outputDir = `${database}_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}`;
    const containerBackupDir = `/backup/${outputDir}`; // This is the directory inside the Docker container

    // Create a dump command for MongoDB
    // If the user is associated with a specific authentication database (e.g., admin), you must use the --authenticationDatabase flag to indicate where the user is stored.
    const dumpCommand = `docker exec mongo_db sh -c "mongodump --uri=${uri}  --port=${port} --username=${user} --password=${password} --authenticationDatabase=admin --db=${database} --gzip --out=${containerBackupDir} "`;
    console.log(`Starting backup for mongo db: ${database}`);
    await new Promise<void>((resolve, reject) => {
      exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
          console.error("Backup failed:", stderr);
          backupFailures.inc()
          return reject(error);
        }

        console.log("Backup completed successfully", stdout);
        return resolve();
      });
    });
    backupSuccess.inc();
    await client.close();
  } catch (error) {
    console.error("Error during backup");
    backupFailures.inc();
    throw error;
  }
};

export const mongoRestore = async ({
  host,
  port,
  user,
  password,
  database,
}: dbParams) => {
  try {
    const uri = `mongodb://${user}:${password}@${host}:${port}`;
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB!");

    const dirName = "./backups/sample_2024-11-23T07-56-08-574Z/sample";
    const restoreDump = `docker exec mongo_db sh -c "mongorestore --gzip --uri=${uri} --username=${user} --password=${password} --authenticationDatabase=admin --db=${database} ${dirName}"`;
    console.log(`Starting db restore for mongo db: ${database}`);

    await new Promise<void>((resolve, reject) => {
      exec(restoreDump, (error, stdout, stderr) => {
        if (error) {
          console.error("Restore failed:", stderr);
          return reject(error);
        }

        console.log("Restore completed successfully", stdout);
        return resolve();
      });
    });

    await client.close();
  } catch (error: any) {
    console.error("Error during restore");
    throw error;
  }
};
