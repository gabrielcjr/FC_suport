FROM php:7.4-cli 

WORKDIR /var/www

RUN apt-get update

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    php -r "if (hash_file('sha384', 'composer-setup.php') === '756890a4488ce9024fc62c56153228907f1545c228516cbf63f885e036d37e9a59d27d63f46af1d4d07ee0f76181c7d3') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
    php composer-setup.php \
    php -r "unlink('composer-setup.php');"

RUN docker-php-ext-install zip \
    php composer.phar create-project --prefer-dist laravel/laravel blog

RUN apt-get install wget \
    wget https://github.com/artisan-roaster-scope/artisan/releases/download/v2.4.4/artisan-linux-2.4.4.deb \
    dpkg -i artisan-linux-2.4.4.deb