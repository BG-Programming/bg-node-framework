sudo -u postgres psql -f _setup/init_role.sql
PGPASSWORD=1234 psql -U bg -h localhost --dbname=bg_programming_skeleton  -f _setup/init_tables.sql
