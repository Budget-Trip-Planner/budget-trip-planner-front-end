FROM node:20-alpine

WORKDIR /app


RUN npm install -g @angular/cli@19


COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 4200

ENTRYPOINT ["/entrypoint.sh"]