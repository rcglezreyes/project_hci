FROM mongo:latest

COPY ./init/init.js /docker-entrypoint-initdb.d/



# FROM mongo:latest

# RUN apt-get update && \
#     apt-get install -y wget gnupg && \
#     echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list && \
#     wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add - && \
#     apt-get update && \
#     apt-get install -y mongodb-org-shell && \
#     rm -rf /var/lib/apt/lists/*

# COPY init.sh /docker-entrypoint-initdb.d/init.sh