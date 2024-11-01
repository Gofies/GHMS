# Citus Cluster Setup

This project provides the files necessary to initialize and manage a Citus cluster. Citus is a distributed database extension that enables PostgreSQL to perform parallel processing and scale-out for distributed queries. This setup includes a configuration with one `master` node and multiple `worker` nodes to distribute data and load.

## Setup and Execution

To start and manage the Citus cluster, use the following commands:

### Makefile Commands

- **Start Citus Cluster**:
  ```bash
  make citus-up
  ```
  This command starts the `citus-master` and `citus-worker` containers in detached mode. It also runs the `init.sh` script, which automatically adds the worker nodes to the master node as part of the Citus cluster.

- **Attach to Citus Master**:
  ```bash
  make attach-citus-master
  ```
  Connects to the `citus-master` database instance, allowing direct access to the master node for executing SQL commands.

- **Attach to Citus Worker**:
  ```bash
  make attach-citus-worker
  ```
  Connects to one of the `citus-worker` database instances for testing and monitoring purposes.

- **Stop Citus Cluster**:
  ```bash
  make citus-down
  ```
  Stops the `citus-master` and `citus-worker` containers to shut down the cluster.

- **View Logs**:
  ```bash
  make citus-logs
  ```
  Follows the logs for both the `citus-master` and `citus-worker` containers, helping with debugging and monitoring cluster activity.

## Example Operations

Once connected to the `citus-master` instance, you can perform distributed table operations, shard verification, and additional cluster management tasks as follows.

### Step 1: Create a Distributed Table and Shard

The following SQL commands create a distributed table and set up sharding based on a specified column (in this case, `id`).

```sql
-- Create a regular table schema
CREATE TABLE distributed_table (
    id BIGINT,
    data TEXT
);

-- Define the table as a distributed table and assign it as a hash-distributed table on the `id` column.
SELECT create_distributed_table('distributed_table', 'id');
```

### Step 2: Insert Data into the Distributed Table

The following SQL command inserts example data into the distributed table. Since this is a distributed setup, Citus automatically shards and distributes the data across available workers.

```sql
INSERT INTO distributed_table (id, data) VALUES 
(1, 'sample data 1'), 
(2, 'sample data 2'), 
(3, 'sample data 3'),
(4, 'sample data 4');
```

### Step 3: Query Data from the Distributed Table

Once data is inserted, you can query the distributed table from the master node. Citus processes the query by retrieving data from the relevant workers.

```sql
SELECT * FROM distributed_table;
```

### Step 4: Verify Shard Distribution

To verify shard distribution in your Citus cluster, you can use the following updated SQL commands. These commands will help you check the configuration and distribution of data across your worker nodes effectively.

- **Check the Distribution of Shards**:
  ```sql
  SELECT * FROM citus_shards;
  ```
  This command retrieves information about all the shards in the cluster, including their distribution across worker nodes, helping you understand how data is partitioned and whether it is evenly distributed.

- **Verify Active Worker Nodes**:
  ```sql
  SELECT * FROM pg_dist_node WHERE isactive = true;
  ```
  This command lists all active worker nodes connected to the master node, ensuring that the worker nodes are properly configured and online, ready to handle distributed queries.

  You can learn more about the details of the commands from [this link](https://docs.citusdata.com/en/v12.1/admin_guide/cluster_management.html#). 
  
This README file will be reorganized for other configuration settings and failover management.


