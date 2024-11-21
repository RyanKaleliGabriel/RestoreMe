import { dbParams } from "../../models/universal";
import mysql from "mysql2/promise";

export const mysqlBackup = async ({
  host,
  port,
  user,
  password,
  database,
}: dbParams) => {
  const conncetion = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
  });

  console.log("Connected to MYSQL!");
  await conncetion.end();
};
