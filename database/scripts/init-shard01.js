#!/bin/bash

var config = {
    "_id": "rs-shard-01",
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "shard01-a:27122",
			"priority": 1
        },
        {
            "_id": 1,
            "host": "shard01-b:27123",
			"priority": 0.5
        }
    ]
};
rs.initiate(config, { force: true });