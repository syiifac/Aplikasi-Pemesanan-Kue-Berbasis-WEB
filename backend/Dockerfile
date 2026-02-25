FROM php:8.2-apache

RUN docker-php-ext-install pdo pdo_mysql \
    && a2enmod rewrite

COPY backend/ /var/www/html/backend
COPY backend/apache.conf /etc/apache2/conf-available/backend.conf

RUN a2enconf backend

EXPOSE 80
