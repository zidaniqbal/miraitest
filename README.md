# MiraiTest - Aplikasi Diary dan Zipcode

Aplikasi web untuk mengelola diary dan mencari informasi kode pos menggunakan Laravel dan React.

## Persyaratan Sistem

-   PHP >= 8.1
-   Node.js >= 16.x
-   Composer
-   MySQL/MariaDB
-   Git

### 1. Persiapan Awal

# Buat database baru di MySQL

mysql -u root -p
CREATE DATABASE miraitest;
exit;

# Clone repository (ganti dengan URL repository Anda)

lakukan git clone atau download zip

# Install dependencies PHP

composer install

# Install dependencies JavaScript

npm install

# Copy file environment

cp .env.example .env

# Generate application key

php artisan key:generate

### 2. Konfigurasi Environment

APP_NAME=MiraiTest
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=miraitest
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=public

### 3. Setup Database dan Storage

# Jalankan migrasi database

php artisan migrate

# Link storage untuk upload gambar

php artisan storage:link

# Publish sanctum configuration

php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

### 4. Install Package yang Diperlukan

# Install package tambahan yang diperlukan

npm install react-router-dom
npm install axios
npm install react-bootstrap bootstrap
npm install bootstrap-icons

### Development Mode

# Terminal 1 - Laravel Server

php artisan serve

# Terminal 2 - Vite Development Server

npm run dev

### Production Mode

# Build assets untuk production

npm run build

# Jalankan server

php artisan serve

### Backend Files

├── app
│ ├── Http
│ │ ├── Controllers
│ │ │ ├── Api
│ │ │ │ ├── AuthController.php
│ │ │ │ └── DiaryController.php
│ │ │ └── ZipcodeController.php
│ ├── Models
│ │ ├── User.php
│ │ ├── Diary.php
│ │ └── Zipcode.php
├── database
│ └── migrations
│ ├── create_users_table.php
│ ├── create_diaries_table.php
│ └── create_zipcodes_table.php
└── routes
├── api.php
└── web.php

### Frontend Files

├── resources
│ ├── js
│ │ ├── components
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ ├── Navbar.jsx
│ │ │ ├── DiaryList.jsx
│ │ │ ├── DiaryForm.jsx
│ │ │ └── Zipcode.jsx
│ │ ├── app.jsx
│ │ └── bootstrap.js
│ └── views
│ └── app.blade.php
