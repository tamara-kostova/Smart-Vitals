# Smart-Vitals
## Secrets env file

Create a secrets.env file with the following variables:

- DSN
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB

## Run docker

sudo docker compose --env-file secrets.env build

sudo docker compose --env-file secrets.env up

## Swagger Docs

Go to http://0.0.0.0:8000/docs