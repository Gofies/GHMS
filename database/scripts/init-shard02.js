#!/bin/bash

var config = {
    "_id": "rs-shard-02",
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "shard02-a:27125",
			"priority": 1
        },
        {
            "_id": 1,
            "host": "shard02-b:27126",
			"priority": 0.5
        }
    ]
};
rs.initiate(config, { force: true });