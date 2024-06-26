docker container stop postgres_db
docker container stop pgadmin4
docker container stop backend
docker container stop frontend
docker container stop nginx
docker container rm postgres_db
docker container rm pgadmin4
docker container rm backend
docker container rm frontend
docker container rm nginx
docker image rm requestresponseanalyzer-frontend
docker image rm dpage/pgadmin4
docker image rm postgres:16
docker image rm requestresponseanalyzer-nginx
docker image rm requestresponseanalyzer-backend
docker volume rm requestresponseanalyzer_frontend
docker volume rm requestresponseanalyzer_static
docker volume rm requestresponseanalyzer_pgdata
docker volume rm requestresponseanalyzer_pgadmin-data
docker network rm requestresponseanalyzer_default
