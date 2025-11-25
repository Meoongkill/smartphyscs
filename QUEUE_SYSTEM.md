# Queue System untuk Prediction API

## Overview

Sistem prediction sekarang menggunakan **Queue** untuk menghindari server overload ketika banyak user selesai test bersamaan.

### Konsep:

-   **Batch Processing**: Process maksimal 3 user sekaligus
-   **Auto Delay**: 2 detik delay antar job dalam 1 batch
-   **5 detik delay** antar batch
-   **Auto Retry**: Retry 3 kali jika gagal
-   **Status Tracking**: Monitor status setiap prediction

---

## Arsitektur

```
User selesai test
    ↓
TestResult dibuat dengan status: pending
    ↓
ProcessBatchPredictionJob triggered
    ↓
Ambil max 3 pending test results
    ↓
Dispatch 3 ProcessPredictionJob (dengan delay 2s antar job)
    ↓
Setiap job:
  - Update status: processing
  - Call ML API
  - Save results
  - Update status: completed
    ↓
Jika masih ada pending, trigger batch berikutnya
```

---

## Status Prediction

| Status       | Deskripsi                        |
| ------------ | -------------------------------- |
| `pending`    | Menunggu di queue untuk diproses |
| `processing` | Sedang diproses oleh worker      |
| `completed`  | Berhasil selesai                 |
| `failed`     | Gagal setelah 3x retry           |

---

## Database Schema

### Kolom Baru di `test_results`:

```sql
prediction_status VARCHAR(255) NULL -- pending, processing, completed, failed
prediction_error TEXT NULL -- Error message jika failed
prediction_queued_at TIMESTAMP NULL -- Kapan masuk queue
prediction_completed_at TIMESTAMP NULL -- Kapan selesai
```

---

## File-File Penting

### 1. **Job Classes**

#### `app/Jobs/ProcessPredictionJob.php`

-   Process 1 test result
-   Timeout: 120 detik
-   Max tries: 3 kali
-   Queue: `predictions`

#### `app/Jobs/ProcessBatchPredictionJob.php`

-   Ambil 3 pending test results
-   Dispatch individual jobs dengan delay
-   Queue: `batch-predictions`

### 2. **Controller**

#### `app/Http/Controllers/UserController.php`

-   Method `processPrediction()` sekarang pakai queue
-   Tidak lagi synchronous

### 3. **Service**

#### `app/Services/PredictionService.php`

-   Update status `completed` saat selesai
-   Update `prediction_completed_at`

---

## Cara Menjalankan Queue Worker

### Development (Local):

```powershell
# Run queue worker
php artisan queue:work --queue=batch-predictions,predictions --tries=3 --timeout=120
```

**Parameter:**

-   `--queue=batch-predictions,predictions`: Process 2 queue ini dengan prioritas
-   `--tries=3`: Retry max 3 kali
-   `--timeout=120`: Timeout 120 detik per job

### Monitor Queue:

```powershell
# Lihat pending jobs
php artisan queue:monitor

# Lihat failed jobs
php artisan queue:failed

# Retry failed job
php artisan queue:retry {job-id}

# Retry semua failed jobs
php artisan queue:retry all

# Clear failed jobs
php artisan queue:flush
```

---

## Production Setup

### 1. **Supervisor (Recommended)**

Install Supervisor di server Linux:

```bash
sudo apt-get install supervisor
```

Config file: `/etc/supervisor/conf.d/laravel-worker.conf`

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/project/artisan queue:work --queue=batch-predictions,predictions --sleep=3 --tries=3 --timeout=120
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/your/project/storage/logs/worker.log
stopwaitsecs=3600
```

Jalankan:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start laravel-worker:*
```

### 2. **Cron Job (Alternative)**

Tambah ke crontab:

```bash
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

Di `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    // Process queue setiap menit
    $schedule->command('queue:work --stop-when-empty --queue=batch-predictions,predictions')
        ->everyMinute()
        ->withoutOverlapping();
}
```

### 3. **Windows Service (Windows Server)**

Pakai NSSM (Non-Sucking Service Manager):

```powershell
# Download NSSM
# https://nssm.cc/download

# Install service
nssm install LaravelQueue "C:\path\to\php.exe" "C:\path\to\artisan queue:work --queue=batch-predictions,predictions --sleep=3 --tries=3"

# Start service
nssm start LaravelQueue
```

---

## Testing

### 1. **Test Queue Locally**

Jalankan worker:

```powershell
php artisan queue:work --queue=batch-predictions,predictions
```

Di browser/Postman, selesaikan test sebagai user.

Lihat log:

```powershell
Get-Content storage/logs/laravel.log -Tail 50 -Wait
```

Expected log:

```
[timestamp] local.INFO: Test result queued for prediction {"user_id":1,"test_result_id":123,"status":"pending"}
[timestamp] local.INFO: Queue: Processing batch {"batch_size":3,"test_result_ids":[123,124,125]}
[timestamp] local.INFO: Queue: Processing prediction {"test_result_id":123,"user_id":1,"attempt":1}
[timestamp] local.INFO: Calling prediction API {"url":"http://localhost:5000/predict","text_length":500}
[timestamp] local.INFO: API call completed {"duration":"2.5s"}
[timestamp] local.INFO: Queue: Prediction completed successfully {"test_result_id":123,"user_id":1}
```

### 2. **Test Multiple Users**

Buat 5 test results sekaligus, akan otomatis:

-   Batch 1: Process user 1, 2, 3 (dengan delay 0s, 2s, 4s)
-   Delay 5 detik
-   Batch 2: Process user 4, 5 (dengan delay 0s, 2s)

### 3. **Test Retry Mechanism**

Matikan server ML, lalu selesaikan test:

-   Job akan gagal
-   Auto retry 2x lagi
-   Setelah 3x gagal, status: `failed`
-   Error message tersimpan di `prediction_error`

---

## Configuration

### Batch Size

Edit `app/Jobs/ProcessBatchPredictionJob.php`:

```php
public $batchSize = 3; // Ganti sesuai kapasitas server ML
```

### Delay Antar Job

```php
$delaySeconds = $index * 2; // Ganti 2 jadi angka lain (dalam detik)
```

### Delay Antar Batch

```php
public $delay = 5; // Delay 5 detik antar batch
```

### Timeout & Retries

Edit `app/Jobs/ProcessPredictionJob.php`:

```php
public $timeout = 120; // Timeout per job (detik)
public $tries = 3; // Max retry
```

---

## Monitoring Status

### Query Database:

```sql
-- Cek pending predictions
SELECT id, user_id, prediction_status, prediction_queued_at
FROM test_results
WHERE prediction_status = 'pending'
ORDER BY prediction_queued_at ASC;

-- Cek processing predictions
SELECT id, user_id, prediction_status, prediction_queued_at
FROM test_results
WHERE prediction_status = 'processing';

-- Cek failed predictions
SELECT id, user_id, prediction_status, prediction_error
FROM test_results
WHERE prediction_status = 'failed';

-- Rata-rata durasi prediction
SELECT
    AVG(TIMESTAMPDIFF(SECOND, prediction_queued_at, prediction_completed_at)) as avg_duration_seconds
FROM test_results
WHERE prediction_status = 'completed';
```

### Laravel Tinker:

```php
php artisan tinker

// Pending count
\App\Models\TestResult::where('prediction_status', 'pending')->count();

// Processing count
\App\Models\TestResult::where('prediction_status', 'processing')->count();

// Failed count
\App\Models\TestResult::where('prediction_status', 'failed')->count();

// Manual retry failed prediction
$testResult = \App\Models\TestResult::find(123);
$testResult->update(['prediction_status' => 'pending']);
\App\Jobs\ProcessBatchPredictionJob::dispatch();
```

---

## Troubleshooting

### Problem: Worker tidak jalan

**Cek:**

```powershell
# Pastikan QUEUE_CONNECTION=database di .env
php artisan config:clear

# Cek apakah ada jobs di database
SELECT * FROM jobs;

# Restart worker
php artisan queue:restart
```

### Problem: Jobs stuck di "processing"

**Solusi:**

```sql
-- Reset ke pending
UPDATE test_results
SET prediction_status = 'pending'
WHERE prediction_status = 'processing'
AND prediction_queued_at < NOW() - INTERVAL 10 MINUTE;
```

### Problem: Failed jobs menumpuk

**Solusi:**

```powershell
# Retry semua
php artisan queue:retry all

# Atau clear semua failed jobs
php artisan queue:flush
```

### Problem: Memory leak di worker

**Solusi:**

```powershell
# Add --max-jobs atau --max-time
php artisan queue:work --max-jobs=1000 --queue=batch-predictions,predictions

# Atau
php artisan queue:work --max-time=3600 --queue=batch-predictions,predictions
```

---

## Benefits

✅ **Tidak overload server ML** - Process bertahap, bukan semua sekaligus  
✅ **Auto retry** - Gagal? Retry otomatis 3x  
✅ **Status tracking** - Tau progress setiap user  
✅ **Scalable** - Bisa tambah worker sesuai kebutuhan  
✅ **Background processing** - User tidak perlu tunggu, langsung dapat response  
✅ **Error handling** - Failed job tersimpan dengan error message

---

## Next Steps

1. ✅ Run migration
2. ✅ Update .env (`QUEUE_CONNECTION=database`)
3. ⏳ Start queue worker
4. ⏳ Test dengan beberapa user sekaligus
5. ⏳ Monitor log dan database
6. ⏳ Setup supervisor/cron di production

---

## Notes

-   Queue worker **HARUS** jalan terus di background
-   Tanpa worker, jobs tidak akan diproses (status stuck di `pending`)
-   Untuk development, jalankan manual: `php artisan queue:work`
-   Untuk production, pakai Supervisor atau Windows Service
-   Log ada di `storage/logs/laravel.log`
