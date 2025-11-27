Markdown

# FIX ARCHIVE - Proje Dokümantasyonu ve Devir Raporu

**Proje Adı:** Fix Archive
**Versiyon:** 1.0.0 (Geliştirme Aşaması)
**Mimari:** Hibrit (Ev Sunucusu + Bulut Tünelleme)
**Konum:** `~/Projeler/fixarchive`

Bu doküman, Fix Archive projesinin teknik mimarisini, dosya yapısını, kurulum adımlarını, güvenlik protokollerini ve geliştirme süreçlerini en ince detayına kadar açıklar. Projeyi devralan mühendis, bu dokümanı okuyarak sistemi sıfırdan ayağa kaldırabilir ve geliştirmeye devam edebilir.

---

## 1. PROJE ÖZETİ VE VİZYON

Fix Archive, özellikle MSI ve Gaming Laptop kullanıcıları için tasarlanmış, **"Doğrulanmış Teknik Bilgi Otoritesi"** olmayı hedefleyen bir teknik destek ve dosya arşivleme platformudur.

* **Temel Amaç:** Kullanıcıların teknik sorunlarına (ısınma, FPS düşüşü vb.) doğrulanmış çözümler sunmak ve `dxdiag`, log dosyaları gibi teknik verileri güvenli bir şekilde depolamak.
* **Güvenlik Felsefesi:** "Zero-Trust" (Sıfır Güven) ve "At-Rest Encryption" (Durağan Veri Şifreleme). Veritabanı ele geçirilse dahi kullanıcı verileri (e-posta vb.) okunamaz.
* **Erişilebilirlik:** Ev sunucusu üzerinde çalışır ancak Cloudflare Tunnel sayesinde dünyaya `ozturu.com` (veya alt alan adları) üzerinden güvenli bir şekilde açılır.

---

## 2. TEKNİK MİMARİ VE ALTYAPI

Sistem, fiziksel bir sunucu (Kasa) ve bir geliştirme ortamından (Laptop) oluşan hibrit bir yapıdadır.

### A. Donanım (Production / Sunucu)
* **Cihaz:** Masaüstü PC (Kasa)
* **Özellikler:** i5 2. Nesil İşlemci, 16GB RAM, 300GB HDD.
* **İşletim Sistemi:** Proxmox VE 9.1 (Sanallaştırma).
* **Sanal Ortam:** Ubuntu 24.04 LXC Konteyneri (ID: 100, IP: `192.168.1.60`).
* **Ağ:** Modem portları kapalıdır. Dış erişim **Cloudflare Tunnel (`cloudflared`)** ile sağlanır.

### B. Yazılım Stack'i (Teknolojiler)

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend** | **React (Vite)** | Kullanıcı arayüzü. Siyah/Dark tema. |
| **Backend** | **Node.js (Express)** | API sunucusu. MVC mimarisi. |
| **Veritabanı** | **PostgreSQL 16** | İlişkisel veritabanı (Docker). |
| **Depolama** | **MinIO** | S3 uyumlu obje depolama (Docker). |
| **Auth** | **JWT + Bcrypt** | Kimlik doğrulama ve oturum yönetimi. |
| **Şifreleme** | **AES-256 + Blind Index** | Veritabanı şifreleme stratejisi. |
| **Proxy** | **Cloudflare Tunnel** | Güvenli dış erişim. |

### C. Servisler ve Portlar

* **Frontend (Dev):** `http://localhost:5173`
* **Backend API:** `http://localhost:3000`
* **Veritabanı (PostgreSQL):** `192.168.1.60:5432`
* **MinIO API:** `192.168.1.60:9000`
* **MinIO Konsol:** `192.168.1.60:9001` (veya `console.ozturu.com`)
* **Portainer:** `192.168.1.60:9443` (Docker Yönetimi)

---

## 3. DOSYA HİYERARŞİSİ VE YAPILANDIRMA

Proje, `~/Projeler/fixarchive` altında iki ana klasöre ayrılmıştır: `backend` ve `frontend`.

### A. Backend (`./backend`)
Node.js tabanlı API sunucusu. Modüler MVC yapısındadır.

```text
backend/
├── config/                 # Konfigürasyon dosyaları
│   ├── db.js               # PostgreSQL bağlantı havuzu (pg-pool)
│   └── minio.js            # MinIO istemci ayarları (minio-js)
├── controllers/            # İş mantığı (Business Logic)
│   ├── authController.js   # Kayıt, Giriş, Token üretimi, Şifreleme
│   └── postController.js   # Gönderi oluşturma, listeleme, dosya yükleme
├── middlewares/            # Ara katman yazılımları
│   └── upload.js           # Multer ayarları (Dosyayı RAM'e alma)
├── routes/                 # API Rotaları (Endpoint tanımları)
│   ├── authRoutes.js       # /login, /register
│   └── postRoutes.js       # /posts, /upload
├── utils/                  # Yardımcı araçlar
│   └── crypto.js           # AES-256 şifreleme ve Blind Index fonksiyonları
├── node_modules/           # Bağımlılıklar (npm install ile gelir)
├── .env                    # [GİZLİ] Veritabanı şifreleri, API anahtarları
├── server.js               # Ana giriş dosyası (App başlatıcı)
├── package.json            # Proje bağımlılık listesi
└── package-lock.json       # Bağımlılık kilit dosyası
B. Frontend (./frontend)
React + Vite tabanlı kullanıcı arayüzü.

Plaintext

frontend/
├── public/                 # Statik dosyalar (Favicon vb.)
├── src/                    # Kaynak kodlar
│   ├── assets/             # Görseller, ikonlar
│   ├── components/         # Tekrar kullanılabilir bileşenler
│   │   └── Sidebar.jsx     # Sol yan menü (Off-Canvas)
│   ├── pages/              # Sayfa bileşenleri (Router hedefleri)
│   │   ├── CreatePost.jsx  # Gönderi oluşturma ve dosya yükleme formu
│   │   ├── Home.jsx        # Ana sayfa akışı (Feed)
│   │   ├── Login.jsx       # Giriş ve Kayıt ekranı (Toggle yapılı)
│   │   ├── PostDetail.jsx  # (Taslak) Gönderi detay sayfası
│   │   ├── Profile.jsx     # (Taslak) Profil sayfası
│   │   └── Register.jsx    # (Kullanılmıyor, Login.jsx içinde birleşti)
│   ├── App.css             # Tüm uygulamanın CSS stilleri (Siyah tema)
│   ├── App.jsx             # Ana uygulama çatısı (Router ve Layout)
│   ├── main.jsx            # React DOM render ve BrowserRouter
│   └── index.css           # Temel CSS sıfırlama
├── node_modules/           # Bağımlılıklar
├── .eslintrc.cjs           # Lint ayarları
├── index.html              # Ana HTML dosyası
├── package.json            # Bağımlılık listesi
├── vite.config.js          # Vite konfigürasyonu
└── tailwind.config.js      # (Kurulu ama aktif olarak kullanılmıyor, CSS custom)
4. GÜVENLİK PROTOKOLLERİ (ZIRHLI KASA MODELİ)
Bu proje, veritabanı sızıntılarına karşı maksimum güvenlik sağlar.

Parola Güvenliği:

Kütüphane: bcrypt

Yöntem: Salted Hash. Parolalar asla açık metin saklanmaz.

E-Posta Gizliliği (At-Rest Encryption):

Kütüphane: Node.js crypto modülü.

Algoritma: AES-256-CBC.

Mekanizma: E-postalar veritabanına şifreli (email_encrypted) olarak yazılır. Anahtar (ENCRYPTION_KEY) sadece sunucunun RAM'inde (.env üzerinden) bulunur. Veritabanı yöneticisi dahi mailleri göremez.

Arama Yapılabilirlik (Blind Indexing):

Sorun: Şifreli veride arama yapılamaz.

Çözüm: E-postanın deterministik bir özeti (email_hash) ayrıca saklanır (HMAC-SHA256). Giriş yapılırken girilen mailin özeti alınır ve bu özet veritabanında aranır.

Oturum Yönetimi:

Teknoloji: JWT (JSON Web Token).

Akış: Giriş başarılı olduğunda sunucu imzalı bir token ve userId döner. Frontend bunu localStorage'a kaydeder.

5. KURULUM VE BAŞLATMA REHBERİ
Projeyi yeni bir makinede ayağa kaldırmak için aşağıdaki adımları izleyin.

Ön Gereksinimler
Node.js (v18+) ve npm.

Çalışan bir PostgreSQL sunucusu (veya Docker konteyneri).

Çalışan bir MinIO sunucusu (veya Docker konteyneri).

1. Backend Kurulumu
Terminali açın ve backend klasörüne gidin: cd backend

Bağımlılıkları yükleyin: npm install

.env dosyasını oluşturun ve şu şablonu doldurun:

Kod snippet'i

# DB
DB_USER=fixuser
DB_HOST=192.168.1.60
DB_NAME=fixarchive
DB_PASSWORD=fixpassword123
DB_PORT=5432

# SECURITY
ENCRYPTION_KEY=32_byte_hex_key_buraya (openssl rand -hex 32)
JWT_SECRET=rastgele_uzun_bir_string_buraya

# MINIO
MINIO_ENDPOINT=192.168.1.60
MINIO_PORT=9000
MINIO_ACCESS_KEY=fixadmin
MINIO_SECRET_KEY=fixstorage123
MINIO_BUCKET=kullanici-dosyalari
Sunucuyu başlatın: node server.js

2. Frontend Kurulumu
Yeni bir terminalde frontend klasörüne gidin: cd frontend

Bağımlılıkları yükleyin: npm install

Uygulamayı başlatın: npm run dev

Tarayıcıda http://localhost:5173 adresine gidin.

3. Veritabanı ve MinIO Hazırlığı
PostgreSQL: users ve posts tablolarını oluşturun (SQL şeması controllers/authController.js içindeki mantığa uygundur: id, username, email_hash, email_encrypted, password_hash).

MinIO: kullanici-dosyalari adında bir kova (bucket) oluşturun ve erişim iznini (Access Policy) public veya readonly yapın (mc anonymous set public fixminio/kullanici-dosyalari).

6. MEVCUT DURUM VE EKSİKLER
Çalışan Özellikler:

[x] Kullanıcı Kaydı (Register) - Şifreli.

[x] Kullanıcı Girişi (Login) - JWT Token ve UserID dönüşü.

[x] Dosya Yükleme (Upload) - MinIO entegrasyonu başarılı.

[x] Gönderi Oluşturma (Create Post) - Veritabanı ve MinIO linklemesi.

[x] Ana Sayfa Akışı (Feed) - Gönderileri listeleme.

[x] Sidebar ve Responsive Tasarım.