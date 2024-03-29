FROM python:3.12.2-bookworm

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV BUILDKIT_PROGRESS=plain

WORKDIR /app/backend

COPY ../. /app/backend

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install gunicorn

ENTRYPOINT ["sh", "/app/backend/docker/entrypoint.sh"]
