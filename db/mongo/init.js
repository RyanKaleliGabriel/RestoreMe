// mongo/init.js

db.createCollection("users");
db.users.insertMany([
  {
    name: "John Doe",
    email: "john.doe@example.com",
    created_at: new Date(),
  },
  {
    name: "Jane smith",
    email: "jane.smith@example.com",
    created_at: new Date(),
  },
]);
