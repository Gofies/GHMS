#!/bin/bash

curl -X POST http://localhost/api/users \
-H "Content-Type: application/json" \
-d '{"name": "Charlie", "email": "charlie@example.com"}'