import fs from "fs";

export const ensureBackupDirectory = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Backup directory created: ${dir}`);
  }
};
