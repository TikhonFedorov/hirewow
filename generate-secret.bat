@echo off
REM Windows batch script to generate JWT secret using Python
REM Requires Python to be installed

echo 🔐 Generating secure secrets for HireWow...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python or use PowerShell script instead
    pause
    exit /b 1
)

REM Generate JWT Secret using Python
python -c "import secrets; print(secrets.token_hex(32))" > temp_jwt.txt
set /p JWT_SECRET=<temp_jwt.txt
del temp_jwt.txt

REM Generate Database Password
python -c "import secrets; import string; chars = string.ascii_letters + string.digits; print(''.join(secrets.choice(chars) for _ in range(32)))" > temp_db.txt
set /p DB_PASSWORD=<temp_db.txt
del temp_db.txt

echo.
echo JWT_SECRET generated:
echo %JWT_SECRET%
echo.
echo Database password generated:
echo %DB_PASSWORD%
echo.
echo 📝 Add these to your backend\.env file:
echo JWT_SECRET=%JWT_SECRET%
echo DATABASE_URL=postgresql://hirewow:%DB_PASSWORD%@db:5432/appdb
echo.
echo 📝 Add this to your root .env file:
echo POSTGRES_PASSWORD=%DB_PASSWORD%
echo.
pause

