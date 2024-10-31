-- Drop table if exists
DROP TABLE IF EXISTS users CASCADE;

-- Create table
CREATE TABLE users (
    id serial primary key,
    name varchar(100)
);

-- Make it distributed
SELECT create_distributed_table('users', 'id');

-- Insert initial data
INSERT INTO users (name) VALUES ('alice'), ('bob');