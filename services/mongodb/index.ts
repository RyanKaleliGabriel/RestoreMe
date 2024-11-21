import { MongoClient } from "mongodb";
import { dbParams } from "../../models/universal";
import { program } from "commander";

export const mongoDbBackup = async ({
  host,
  port,
  user,
  password,
  database,
}: dbParams) => {
  const uri = `mongodb://${user}:${password}@${host}:${port}`;
  const client = new MongoClient(uri);
  await client.connect();
  console.log("Connected to MongoDB!");
  await client.close();
};


