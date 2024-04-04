FROM nginx:latest

ENV BUILDKIT_PROGRESS=plain

RUN rm /etc/nginx/conf.d/*
RUN mkdir -p /etc/nginx/conf.d/
COPY ../nginx.conf /etc/nginx/conf.d/
RUN mkdir -p /app/logs/nginx/
RUN touch /app/logs/nginx/nginx-access.log && touch /app/logs/nginx/nginx-error.log

EXPOSE 80
EXPOSE 443

STOPSIGNAL SIGQUIT

CMD [ "nginx", "-g", "daemon off;" ]
