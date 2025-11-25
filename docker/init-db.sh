#!/bin/bash
set -e

mysql -u root -proot <<-EOSQL
    CREATE DATABASE IF NOT EXISTS smartpsychassist;
    CREATE USER IF NOT EXISTS 'smartpsychassist'@'%' IDENTIFIED BY 'smartpsychassist';
    GRANT ALL PRIVILEGES ON smartpsychassist.* TO 'smartpsychassist'@'%';
    FLUSH PRIVILEGES;
EOSQL
