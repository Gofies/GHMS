#!/bin/bash

# Wait for MongoDB instances to be ready
sleep 10

# Initialize Config Server Replica Set
mongosh --host configsvr1 --port 27019 --eval '
  rs.initiate({
    _id: "configReplSet",
    configsvr: true,
    members: [{ _id: 0, host: "configsvr1:27019" }]
  });
'

# Initialize Shard1 Replica Set
mongosh --host shard1 --port 27018 --eval '
  rs.initiate({
    _id: "shard1ReplSet",
    members: [{ _id: 0, host: "shard1:27018" }]
  });
'

# Initialize Shard2 Replica Set
mongosh --host shard2 --port 27017 --eval '
  rs.initiate({
    _id: "shard2ReplSet",
    members: [{ _id: 0, host: "shard2:27017" }]
  });
'

# Wait for Replica Sets to initialize
sleep 10

# Add Shards to Router (mongos)
mongosh --host mongos --port 27020 --eval '
  sh.addShard("shard1ReplSet/shard1:27018");
  sh.addShard("shard2ReplSet/shard2:27017");
'

echo "MongoDB Shard Initialization complete!"
