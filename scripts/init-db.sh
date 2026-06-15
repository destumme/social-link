#!/usr/bin/env bash
set -eo pipefail

if [ $# -ne 2 ]; then
  echo "Usage: $0 <root_user> <root_password>"
  exit 1
fi

ROOT_USER="$1"
ROOT_PW="$2"

for var in PG_USER PG_PW PG_DB; do
  if [ -z "${!var}" ]; then
    echo "Error: $var is not set or empty" >&2
    exit 1
  fi
done

docker compose exec -T -e PGPASSWORD="$ROOT_PW" postgres \
  psql -U "$ROOT_USER" -d postgres \
  -v pg_user="$PG_USER" \
  -v pg_pw="$PG_PW" \
  -v pg_db="$PG_DB" <<'SQL'
SELECT format('CREATE USER %I WITH PASSWORD %L', :'pg_user', :'pg_pw')
WHERE NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = :'pg_user')\gexec

SELECT format('CREATE DATABASE %I OWNER %I', :'pg_db', :'pg_user')
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'pg_db')\gexec
SQL
