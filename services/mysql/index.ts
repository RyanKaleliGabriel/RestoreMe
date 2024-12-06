import mysql from "mysql2/promise";
import { dbParams } from "../../models/universal";
import { backupExec, restoreExec } from "../../utils/exec";


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

    await backupExec("mysql", {
      host,
      port,
      user,
      password,
      database,
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

    await restoreExec("mysql", {
      host,
      port,
      user,
      password,
      database,
    });

    await conncetion.end();
  } catch (error: any) {
    console.error("Error during restoring", error);
    throw error;
  }
};
