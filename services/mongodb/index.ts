import { MongoClient } from "mongodb";
import { dbParams } from "../../models/universal";
import path from "path";
import { ensureBackupDirectory } from "../../utils/ensureBackupDirectory";
import { exec } from "child_process";

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
    const dumpCommand = `docker exec mongo_db sh -c "mongodump --uri=${uri}  --port=${port} --username=${user} --password=${password} --authenticationDatabase=admin --db=${database} --gzip --out=${containerBackupDir}"`;
    console.log(`Starting backup for mongo db: ${database}`);
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
    await client.close();
  } catch (error) {
    console.error("Error during backup");
    throw error;
  }
};
