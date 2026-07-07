FROM alpine:3.20 AS assets
WORKDIR /site

COPY index.html ./
COPY admin.html ./
COPY app.js ./
COPY styles.css ./

FROM nginx:alpine AS runtime

# Copiar configuracion de NGINX
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estaticos desde la etapa de armado
COPY --from=assets /site/index.html /usr/share/nginx/html/
COPY --from=assets /site/admin.html /usr/share/nginx/html/
COPY --from=assets /site/app.js /usr/share/nginx/html/
COPY --from=assets /site/styles.css /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
