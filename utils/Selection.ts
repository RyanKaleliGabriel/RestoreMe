const selectedDatabase = (database: string) => {
  switch (database) {
    case "mongodb":
      return `
      Command to backup a ${database} database is: 'node dist/backup.js backup --db-type mongodb --host localhost --port 27017 --user sample --password secret --database sample'
      Command to restore a ${database} database is: 'node dist/restore.js restore --db-type mongodb --host localhost --port 27017 --user sample --password secret --database sample'
      `;

    case "postgres":
      return `
      Command to backup a ${database} database is: 'node dist/backup.js backup --db-type postgres --host localhost --port 5432 --user sample --password secret --database sample'
      Command to restore a ${database} database is: 'node dist/restore.js restore --db-type postgres --host localhost --port 5432 --user sample --password secret --database sample'
      `;

    case "mysql":
      return `
      Command to backup a ${database} database is: 'node dist/backup.js backup --db-type mysql --host localhost --port 3306 --user root --password secret --database sample'
      Command to restore a ${database} database is: 'node dist/restore.js restore --db-type mysql --host localhost --port 3306 --user root --password secret --database sample'
      `;

    default:
      throw new Error("Invalid selection. Please choose a database to backup.");
  }
};

export default selectedDatabase;
