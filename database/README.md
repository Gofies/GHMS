Overview
--------
This section describes the MongoDB cluster configuration used for the Hospital Management System (GHMS). The cluster is set up using Docker Compose and includes MongoDB routers, config servers, and shard servers to provide a horizontally scalable and highly available database infrastructure.

Cluster Configuration
---------------------
The MongoDB cluster consists of the following key components:

- Config Servers: 
  - configsvr01: Stores the cluster's metadata and configuration.
  - configsvr02: A secondary config server for redundancy.
  
- Shard Servers: 
  - shard01-a, shard01-b: The primary shard replica set (rs-shard-01).
  - shard02-a, shard02-b: The secondary shard replica set (rs-shard-02).
  - shard03-a, shard03-b: The third shard replica set (rs-shard-03).
  
- Router Servers:
  - router01: Acts as the entry point for client applications, routing requests to the correct shard.
  - router02: A secondary router for load balancing and redundancy.

Cluster Initialization
----------------------
Once the Docker containers for the MongoDB cluster are running, you can initialize the cluster and set up the replica sets using the following steps:

1. Start the MongoDB Cluster:
   Bring up the MongoDB cluster by running the following Makefile command:

    ```bash
    make mongo-build
    make mongo-up
    ```

   This command will start all Docker containers for MongoDB, including the config servers, shard servers, and router servers. You can check the status of the containers using docker-compose ps to ensure all components are running.

2. Attach to MongoDB Containers:
   After starting the cluster, you can attach to one of the MongoDB router containers to interact with the database. Use the following command:

    ```bash
    make attach-mongo
    ```

   This command will open a MongoDB shell connected to one of the router servers, allowing you to issue commands to the cluster.

3. Check Sharding Configuration:
   Once connected to the MongoDB router shell, you can use the following commands to check and manage sharding:

   - Check Shard Status:
     To view the status of the sharded cluster, including the sharding configuration, use the following command:

    ```bash
     sh.status()
    ```

     This will display the current state of the shards, the collections being sharded, and other useful information about the cluster’s configuration.

   - Check 
     To retrieve information about how the data in a sharded collection is distributed across the different shards in the cluster, you can use these commands (Ex: for patients collection): 
     
    ```bash
     use HospitalDatabase
     db.patients.getShardDistribution()
    ```
     
     These commands help you understand the distribution of chunks (data partitions) and the amount of data on each shard.