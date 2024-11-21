import { dbParams } from "../../models/universal";
import { Client } from "pg";

export const postgresBackup = async ({
  host,
  port,
  user,
  password,
  database,
}: dbParams) => {
  const client = new Client({
    host,
    port,
    user,
    password,
    database,
  });

  await client.connect();
  console.log(`Connected to postgreSQL!`);
  await client.end();
};
