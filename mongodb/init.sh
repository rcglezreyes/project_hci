#!/bin/bash
echo "==> Waiting for MongoDB to start..."

for i in {1..30}; do
  if mongo --host 127.0.0.1 --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "MongoDB is up!"
    break
  fi
  echo "Waiting for Mongo ($i/30)..."
  sleep 2
done

if [ "$i" -eq 30 ]; then
  echo "MongoDB did not become ready in time. Exiting."
  exit 1
fi

echo "==> MongoDB is ready. Running init script..."

echo "===> Creating users..."

mongo <<EOF
use admin
db.createUser({
  user: "$MONGO_INITDB_ROOT_USERNAME",
  pwd: "$MONGO_INITDB_ROOT_PASSWORD",
  roles: [{ role: "root", db: "admin" }]
})
EOF

mongo <<EOF
use $MONGO_DB_DATABASE_NAME
db.createUser({
  user: "$MONGO_DB_USERNAME",
  pwd: "$MONGO_DB_PASSWORD",
  roles: [
    { role: "readWrite", db: "$MONGO_DB_DATABASE_NAME" },
    { role: "dbAdmin", db: "$MONGO_DB_DATABASE_NAME" }
  ]
})
EOF

echo "Users created successfully."

exec docker-entrypoint.sh mongod
