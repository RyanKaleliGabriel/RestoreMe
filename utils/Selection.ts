import { mongoDbBackup } from "../databases/mongodb";
import { mysqlBackup } from "../databases/mysql";
import { postgresBackup } from "../databases/postgresql";
import { redisBackup } from "../databases/redis";

const selectedDatabase = (database: string) => {
  switch (database) {
    case "mongodb":
      return mongoDbBackup();

    case "postgres":
      return postgresBackup();

    case "mysql":
      return mysqlBackup();

    case "redis":
      return redisBackup();

    default:
      throw new Error("Invalid selection. Please choose a database to backup.");
  }
};

export default selectedDatabase;
