import { Command } from "commander";
import { postgresBackup } from "./services/postgresql";
import { mysqlBackup } from "./services/mysql";
import { mongoDbBackup } from "./services/mongodb";
import { error } from "console";
const program = new Command();

program
  .command("backup")
  .description("Backup a database")
  .requiredOption(
    "-dt, --db-type <type>",
    "Database type (postgres, mysql, mongodb)"
  )
  .requiredOption("-h, --host <host>", "Database host")
  .requiredOption("-p, --port <port>", "Database port")
  .requiredOption("-u, --user <user>", "Database user")
  .requiredOption("-ps, --password <password>", "Database password")
  .requiredOption("-d, --database <name>", "Database name")
  .action(async (options) => {
    try {
      const { dbType, host, port, user, password, database } = options;

      switch (dbType) {
        case "postgres":
          await postgresBackup(options);
          break;
        case "mysql":
          await mysqlBackup(options);
          break;
        case "mongodb":
          await mongoDbBackup(options);
          break;
        default:
          console.error("Unsupported database type");
      }
    } catch (error: any) {
      console.error("Backup failed:", error.message);
    }
  });

program.parse(process.argv);
