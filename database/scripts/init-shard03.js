#!/bin/bash

var config = {
    "_id": "rs-shard-03",
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "shard03-a:27128",
			"priority": 1
        },
        {
            "_id": 1,
            "host": "shard03-b:27129",
			"priority": 0.5
        }
    ]
};
rs.initiate(config, { force: true });