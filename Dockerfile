FROM nginx:alpine

WORKDIR /run

## copy files
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY build /run/html
COPY create-env.sh /run/create-env.sh

## set permissions
RUN chown -R nginx. /run
RUN chmod -R 700 /run

## entrypoint
EXPOSE 80
ENTRYPOINT ["sh", "/run/create-env.sh"]