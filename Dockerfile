# Use the official PHP image with the necessary extensions
FROM php:8.1-fpm AS combined-stage

# Install necessary system dependencies, including Node.js
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    curl \
    && curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install PHP extensions
RUN docker-php-ext-install opcache

# Install Laravel dependencies
RUN composer install 

# Run Laravel optimization commands
RUN php artisan optimize

# Install frontend dependencies
RUN npm install --legacy-peer-deps

# Build the frontend assets
RUN npm run build

RUN curl https://frankenphp.dev/install.sh | sh \
    && mv frankenphp /usr/local/bin/

RUN chown -R www-data:www-data ./storage ./bootstrap/cache

# Install Redis extension
RUN pecl install redis \    
    && docker-php-ext-enable redis

# Install PHP extensions
RUN docker-php-ext-install opcache

# Expose the port that FrankenPHP will run on
EXPOSE 80

# Start FrankenPHP
CMD /var/www/entrypoint.sh
