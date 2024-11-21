import { select } from "@inquirer/prompts";
import selectedDatabase from "./utils/Selection";

const backupProcess = async () => {
  const answer = await select({
    message: "Select a database to backup",
    choices: [
      {
        name: "postgres",
        value: "postgres",
        description:
          " A powerful, open-source relational database management system known for its advanced features, extensibility, and strong support for ACID compliance and complex queries.",
      },
      {
        name: "mysql",
        value: "mysql",
        description:
          " A widely used open-source relational database known for its speed, ease of use, and reliability, popular in web applications and scalable environments.",
      },
      {
        name: "mongodb",
        value: "mongodb",
        description:
          "A NoSQL database that stores data in flexible, JSON-like documents, making it ideal for unstructured or semi-structured data and applications requiring high scalability.",
      },
    ],
  });

  return selectedDatabase(answer);
};

backupProcess()
  .then((result) => console.log(result))
  .catch((error: any) => console.log(error));
