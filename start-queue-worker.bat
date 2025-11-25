@echo off
echo Starting Laravel Queue Worker...
echo.
echo Queue: batch-predictions,predictions
echo Tries: 3
echo Timeout: 120s
echo.
echo Press Ctrl+C to stop
echo.
php artisan queue:work --queue=batch-predictions,predictions --tries=3 --timeout=120 --sleep=3
