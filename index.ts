import dotenv from "dotenv";
import express, { Request, Response } from "express";
import promClient, { collectDefaultMetrics, Counter } from "prom-client";

dotenv.config();

const app = express();
const port = process.env.PROM_PORT;

collectDefaultMetrics();

//Counters for backup success and failures.
export const backupSuccess = new Counter({
  name: "backup_success",
  help: "Total number of successful backups",
});

export const backupFailures = new Counter({
  name: "backup_failure_total",
  help: "Total failed backups",
});


app.get("/metrics", async (req: Request, res: Response) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// SImulate backup


app.listen(port, () => console.log(`Metrics server runiing on port ${port}`));
