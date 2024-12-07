Database Backup Utility

> A command-line interface (CLI) utility for backing up any type of database. The utility will support various database management systems (DBMS) such as MySQL, PostgreSQL, MongoDB.

## Table of Contents

- [Take Aways](#take-aways)
- [Features](#features)
- [Stack](#stack)
- [Usage](#usage)
- [Project URL](#project-url)

## Take Aways

- Deeper understanding of database management systems, backup strategies, command-line interface development, and error handling.

- Local and cloud storage integration and logging mechanisms.

## Features

1. Backup Operations: Support full backup type .
2. Compression: Compress backup files to reduce storage space.
3. Local Storage: Allow users to store backup files locally on the system.
4. Logging: Logs of backup and restore activities, including start time, end time, status, time taken, and any errors encountered.
5. Notifications: Slack notification on completion of backup operations and recoveries.
6. Restore Backup: A restore operation to recover the database from a backup file.

## Stack

- Node Js
- Docker
- Slack
- Postgres
- MongoDb
- MySql

## Usage

1. Clone the repository

   ```bash
   https://github.com/RyanKaleliGabriel/RestoreMe.git
   cd RestoreMe
   ```

2. Set Environment Variables

```bash
POSTGRES_PASSWORD=<your_db_password>
POSTGRES_USER=<your_db_user>
POSTGRES_DB=<your_db_name>

MYSQL_PASSWORD=<your_db_password>
MYSQL_USER=<your_db_user>
MYSQL_DATABASE=<your_db_name>

MONGO_USERNAME=<your_db_user>
MONGO_PASSWORD=<your_db_password>
MONGO_DATABASE=<your_db_name>

SLACK_OAUTH_TOKEN=<your_slack_bot_oauth_token>
CHANNEL_ID=<your_slack_channel_id>
```

3. Running the CLI: This command will.

```bash
# Run the docker containers. These containers have the official images of the databases and file mounts.
docker compose up --build
```


4. Start the options service and give you a list of databases to select.

```bash
npm run dev

? Select a database to backup (Use arrow keys)
❯ postgres
  mysql
  mongodb
 A powerful, open-source relational database management system known for its advanced features, extensibility, and strong support for ACID compliance and complex queries.
```

5. Once you select a database a list of commands to backup and restore the selected database will be displayed

```bash
✔ Select a database to backup postgres

      Command to backup a postgres database is: 'node dist/backup.js backup --db-type postgres --host localhost --port 5432 --user <database_user> --password <database_password> --database <database_name>'
      Command to restore a postgres database is: 'node dist/restore.js restore --db-type postgres --host localhost --port 5432 --user <database_user> --password <database_password> --database <database_name>'
```

6. Copy the command you wish to run

```bash
# Backup Logs
node dist/backup.js backup --db-type postgres --host localhost --port 5432 --user <database_user> --password <database_password> --database <database_name>
Connected to postgreSQL!
/home/ryankaleligabriel/Documents/backend/RestoreMe/backups/postgres-sample_2024-12-06T10-55-00-374Z.sql.gz
[INFO] Starting postgres database backup process
[INFO] Backup start time: 1:20:51 PM
Backup completed successfully 
[INFO] Backup end time: 1:20:52 PM
[INFO] Time take: -538 ms
Message sent to slack:  1733566853.027299

# Backup restore logs:
node dist/restore.js restore --db-type postgres --host localhost --port 5432 --user <database_user> --password <database_password> --database <database_name>
Connected to postgres db: sample
[INFO] Starting postgres database restore process
[INFO] Restore start time: 1:22:29 PM
Restore completed successfully SET
[INFO] Restore end time: 1:22:29 PM
[INFO] Time take: 283 ms
Message sent to slack:  1733566950.387149
```

7. You can access the data in the databases to backup the data, delete the data and finally restore to see how the backup and restore works.

```bash
# Accessing MongoDb
docker exec -it mongo_db mongosh -u <database_name> -p <database_secret> --authenticationDatabase admin

# Accessing Mysql
docker exec -it mysql_db mysql -u root -p <database_password>

# Accessing PostgresDb
docker exec -it postgres_db psql -U <database_name>
```

## Project URL
https://roadmap.sh/projects/database-backup-utility
