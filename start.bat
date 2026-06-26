@echo off
title SpaProMax - Khoi dong he thong
color 0A

echo.
echo  =========================================
echo   SpaProMax - He Thong Quan Ly Spa
echo  =========================================
echo.

REM --- Thu cac ten service MySQL pho bien cua XAMPP ---
echo [1/2] Kiem tra va khoi dong MySQL...

sc query mysql >nul 2>&1
if %errorlevel% equ 0 (
    net start mysql >nul 2>&1
    echo  [OK] Da khoi dong MySQL service.
    goto :run_server
)

sc query MySQL80 >nul 2>&1
if %errorlevel% equ 0 (
    net start MySQL80 >nul 2>&1
    echo  [OK] Da khoi dong MySQL80 service.
    goto :run_server
)

REM --- Neu khong co service thi dung mysqld.exe cua XAMPP truc tiep ---
set XAMPP_MYSQL=C:\xampp\mysql\bin\mysqld.exe
if exist "%XAMPP_MYSQL%" (
    echo  [OK] Tim thay XAMPP MySQL. Dang khoi dong...
    start "" /B "%XAMPP_MYSQL%" --defaults-file="C:\xampp\mysql\bin\my.ini"
    timeout /t 3 /nobreak >nul
    echo  [OK] MySQL da duoc khoi dong qua XAMPP.
    goto :run_server
)

REM --- Neu tat ca deu that bai ---
echo.
echo  [LOI] Khong tim thay MySQL!
echo  --^> Hay mo XAMPP Control Panel va bat MySQL truoc, roi chay lai file nay.
echo  --^> Hoac kiem tra XAMPP duoc cai tai: C:\xampp\
echo.
pause
exit /b 1

:run_server
echo.
echo [2/2] Khoi dong Node.js server...
echo.
echo  =========================================
echo   Web dang chay tai: http://localhost:3002
echo   Nhan Ctrl+C de dung server
echo  =========================================
echo.

cd /d "%~dp0backend"
node server.js

echo.
echo  Server da dung. Nhan phim bat ky de dong cua so...
pause >nul
