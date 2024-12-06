import { MongoClient } from "mongodb";
import { dbParams } from "../../models/universal";
import { backupExec, restoreExec } from "../../utils/exec";

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

    await backupExec("mongo", {
      host,
      port,
      user,
      password,
      database,
    });

    await client.close();
  } catch (error) {
    console.error("Error during backup");
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

    await restoreExec("mongo", {
      host,
      port,
      user,
      password,
      database,
    });

    await client.close();
  } catch (error: any) {
    console.error("Error during restore");
    throw error;
  }
};
