#!/bin/sh

cd /app/backend || exit

python3.12 manage.py makemigrations
python3.12 manage.py migrate
python3.12 manage.py collectstatic --no-input
# Performing unittests
python3.12 manage.py test

gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 4 --threads 4
