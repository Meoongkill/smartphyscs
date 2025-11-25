# Setup Prediction API

## 1. Cara Setting URL Server ML/Python

Edit file `.env` di root project:

```env
PREDICTION_API_URL=http://localhost:5000/predict
```

### Contoh Konfigurasi:

#### A. Server Lokal (di komputer yang sama):

```env
PREDICTION_API_URL=http://localhost:5000/predict
```

#### B. Server di Jaringan Lokal (LAN):

```env
PREDICTION_API_URL=http://192.168.1.100:5000/predict
```

_Ganti `192.168.1.100` dengan IP komputer yang menjalankan server Python_

#### C. Server Online (Production):

```env
PREDICTION_API_URL=https://ml-server.yourdomain.com/predict
```

#### D. Server dengan Port Custom:

```env
PREDICTION_API_URL=http://your-server-ip:8080/predict
```

---

## 2. Cara Mengecek URL Server ML/Python yang Benar

### Cek IP Komputer Server (di komputer yang menjalankan Python):

**Windows:**

```powershell
ipconfig
```

Cari "IPv4 Address" - contoh: `192.168.1.100`

**Linux/Mac:**

```bash
ifconfig
# atau
ip addr show
```

### Test Server Berjalan:

```powershell
# Di komputer yang sama dengan server Python
curl http://localhost:5000/predict -X POST -H "Content-Type: application/json" -d "{\"text\":\"test\"}"

# Dari komputer lain di jaringan
curl http://192.168.1.100:5000/predict -X POST -H "Content-Type: application/json" -d "{\"text\":\"test\"}"
```

---

## 3. Mode Testing (Pakai Dummy Data)

Kalau server ML belum siap, sistem otomatis pakai dummy data:

File: `app/Http/Controllers/Api/PredictionController.php`

```php
// Ubah parameter kedua:
// true = pakai dummy data (tidak call server ML)
// false = call server ML asli
$prediction = $this->predictionService->predict($text, true);
```

---

## 4. Monitoring/Debug

### Lihat Log Laravel:

```powershell
# Windows
Get-Content storage/logs/laravel.log -Tail 50 -Wait
```

Log akan menampilkan:

-   URL API yang dipanggil
-   Durasi request (berapa lama)
-   Status response (sukses/gagal)
-   Error message jika gagal

### Format Log:

```
[timestamp] local.INFO: PredictionService initialized {"api_url":"http://localhost:5000/predict"}
[timestamp] local.INFO: Calling prediction API {"url":"http://localhost:5000/predict","text_length":500}
[timestamp] local.INFO: API call completed {"duration":"2.5s"}
[timestamp] local.INFO: Prediction successful
```

---

## 5. Troubleshooting

### Problem: Request Terlalu Lama (Loading terus)

**Solusi:**

-   Timeout sudah dikurangi jadi 10 detik (dari 30 detik)
-   Cek log untuk lihat error message
-   Pastikan server ML benar-benar aktif
-   Test pakai curl atau Postman langsung ke server ML

### Problem: Connection Refused

**Solusi:**

-   Pastikan server ML sudah running
-   Cek firewall - allow port yang digunakan
-   Pastikan URL dan Port benar

### Problem: 404 Not Found

**Solusi:**

-   Pastikan endpoint `/predict` benar
-   Cek dokumentasi server ML untuk endpoint yang benar

### Problem: 500 Internal Server Error

**Solusi:**

-   Lihat log server ML
-   Cek format data yang dikirim sudah sesuai
-   Server ML mungkin error processing

---

## 6. Test Endpoint Laravel

### A. Test Prediction API (menggunakan Postman):

**Endpoint:**

```
POST http://localhost:8000/api/predict
```

**Headers:**

```
Content-Type: application/json
Accept: application/json
```

**Body (JSON):**

```json
{
    "text": "Saya selalu berusaha untuk jujur dalam setiap tindakan"
}
```

**Response Success:**

```json
{
    "success": true,
    "data": {
        "predictions": {
            "Integritas": {
                "predicted_level": 4,
                "similarity_score": 0.849
            },
            ...
        }
    }
}
```

### B. Test dengan cURL:

```powershell
curl -X POST http://localhost:8000/api/predict `
  -H "Content-Type: application/json" `
  -H "Accept: application/json" `
  -d '{"text":"Test jawaban peserta"}'
```

---

## 7. Production Checklist

-   [ ] Update `PREDICTION_API_URL` di `.env` production
-   [ ] Test koneksi ke server ML dari server Laravel
-   [ ] Pastikan firewall/security group allow koneksi
-   [ ] Set `APP_DEBUG=false` di production
-   [ ] Monitor log untuk error
-   [ ] Setup fallback mechanism (sudah ada - auto pakai dummy jika API gagal)

---

## 8. Perubahan yang Sudah Dilakukan

✅ Timeout dikurangi dari 30 detik → 10 detik (lebih cepat timeout)
✅ Tambah logging lengkap untuk tracking
✅ Auto fallback ke dummy data jika API gagal
✅ Environment variable `PREDICTION_API_URL` untuk config mudah
✅ Dokumentasi lengkap untuk setup

---

## Notes:

-   Sistem akan **auto fallback** ke dummy data jika server ML error
-   Log semua activity ke `storage/logs/laravel.log`
-   Bisa ganti URL server kapan saja tanpa ubah code (hanya edit .env)
-   Restart Laravel setelah edit .env: `php artisan config:clear`
