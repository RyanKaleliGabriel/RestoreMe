import { Command } from "commander";
import { mongoRestore } from "./services/mongodb";
import { mysqlRestore } from "./services/mysql";
import { postgresRestore } from "./services/postgresql";

const program = new Command();

program
  .command("restore")
  .description("Restore a backed up database")
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
          await postgresRestore(options);
          break;
        case "mysql":
          await mysqlRestore(options);
          break;
        case "mongodb":
          await mongoRestore(options);
          break;
        default:
          console.error("Unsupported database type");
      }
    } catch (error: any) {
      console.error("Backup restore failed", error.message);
    }
  });

  program.parse(process.argv)