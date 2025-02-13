# MiraiTest - Aplikasi Diary dan Zipcode

![MiraiTest Banner](https://via.placeholder.com/1200x400?text=MiraiTest+Diary+%26+Zipcode)

**MiraiTest** adalah aplikasi berbasis web yang memungkinkan pengguna untuk mengelola diary pribadi dan mencari informasi kode pos. Aplikasi ini dibangun menggunakan **Laravel** di backend dan **React** di frontend.

---

## 🚀 Fitur Utama

-   📖 **Kelola Diary**: Tambah, edit, dan hapus catatan harian dengan mudah.
-   📍 **Cari Kode Pos**: Temukan informasi kode pos berdasarkan lokasi.
-   🔐 **Autentikasi**: Sistem login dan registrasi menggunakan Laravel Sanctum.
-   🎨 **UI Modern**: Menggunakan React dan Bootstrap untuk tampilan yang responsif.

---

## 🛠 Persyaratan Sistem

Pastikan Anda memiliki perangkat lunak berikut terinstal sebelum memulai:

-   ✅ PHP >= 8.1
-   ✅ Node.js >= 16.x
-   ✅ Composer
-   ✅ MySQL/MariaDB
-   ✅ Git

---

## 📌 Instalasi dan Konfigurasi

### 1️⃣ **Persiapan Awal**

```bash
# Clone repository
git clone https://github.com/username/miraitest.git
cd miraitest

# Install dependencies PHP
composer install

# Install dependencies JavaScript
npm install

# Copy file environment
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 2️⃣ **Konfigurasi Environment**

Edit file `.env` sesuai dengan pengaturan database Anda:

```env
APP_NAME=MiraiTest
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=miraitest
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=public
```

### 3️⃣ **Setup Database & Storage**

```bash
# Buat database baru di MySQL
mysql -u root -p -e "CREATE DATABASE miraitest;"

# Jalankan migrasi database
php artisan migrate

# Link storage untuk upload gambar
php artisan storage:link

# Publish sanctum configuration
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 4️⃣ **Install Package yang Diperlukan**

```bash
npm install react-router-dom axios react-bootstrap bootstrap bootstrap-icons
```

---

## 🔥 Mode Pengembangan & Produksi

### **Development Mode**

```bash
# Jalankan Laravel server
php artisan serve

# Jalankan Vite development server
npm run dev
```

### **Production Mode**

```bash
# Build assets untuk produksi
npm run build

# Jalankan server
php artisan serve
```

---

## 📁 Struktur Direktori

### **Backend (Laravel)**

```
├── app
│   ├── Http
│   │   ├── Controllers
│   │   │   ├── Api
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── DiaryController.php
│   │   │   │   └── ZipcodeController.php
│   ├── Models
│   │   ├── User.php
│   │   ├── Diary.php
│   │   └── Zipcode.php
├── database
│   ├── migrations
│   │   ├── create_users_table.php
│   │   ├── create_diaries_table.php
│   │   └── create_zipcodes_table.php
└── routes
    ├── api.php
    └── web.php
```

### **Frontend (React)**

```
├── resources
│   ├── js
│   │   ├── components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── DiaryList.jsx
│   │   │   ├── DiaryForm.jsx
│   │   │   └── Zipcode.jsx
│   │   ├── app.jsx
│   │   └── bootstrap.js
│   ├── views
│   │   └── app.blade.php
```

---

@zidaniqbal
