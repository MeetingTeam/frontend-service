FROM nginx:alpine

WORKDIR /run

## copy files
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY build /run/html

## set permissions
RUN chown -R nginx:nginx /run
RUN chmod -R 700 /run

## entrypoint
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]