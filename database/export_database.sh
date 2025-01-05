#!/bin/bash

source ../.env

models=("admins" "appointments" "diagnoses" "doctors" "hospitals" "labtechnicians" "labtests" "patients" "polyclinics" "prescriptions" "treatments")
for model in "${models[@]}"; do
    docker exec router-01 sh -c "mongoexport --host router-01 --port 27117 --db HospitalDatabase --collection=$model --out=/new_mocks/${model}.json --username $MONGO_USERNAME --password $MONGO_PASSWORD --authenticationDatabase admin"
done
