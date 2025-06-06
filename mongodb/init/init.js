const rootUser = process.env.MONGO_INITDB_ROOT_USERNAME;
const rootPwd = process.env.MONGO_INITDB_ROOT_PASSWORD;

const adminDb = db.getSiblingDB('admin');

const userExists = adminDb.system.users.find({ user: rootUser }).count();

if (userExists === 0) {
  adminDb.createUser({
    user: rootUser,
    pwd: rootPwd,
    roles: [{ role: "root", db: "admin" }]
  });
}