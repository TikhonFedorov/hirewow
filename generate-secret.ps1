# PowerShell script to generate secure secrets for Windows
# Usage: .\generate-secret.ps1

Write-Host "🔐 Generating secure secrets for HireWow..." -ForegroundColor Cyan
Write-Host ""

# Generate JWT Secret (64 hex characters = 32 bytes)
$jwtSecret = -join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})
# Better method using .NET
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$jwtSecret = [System.BitConverter]::ToString($bytes).Replace("-", "").ToLower()

# Generate Database Password (32 random characters)
$dbPassword = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Write-Host "JWT_SECRET generated:" -ForegroundColor Green
Write-Host $jwtSecret -ForegroundColor Yellow
Write-Host ""

Write-Host "Database password generated:" -ForegroundColor Green
Write-Host $dbPassword -ForegroundColor Yellow
Write-Host ""

Write-Host "📝 Add these to your backend\.env file:" -ForegroundColor Cyan
Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor White
Write-Host "DATABASE_URL=postgresql://hirewow:$dbPassword@db:5432/appdb" -ForegroundColor White
Write-Host ""
Write-Host "📝 Add this to your root .env file:" -ForegroundColor Cyan
Write-Host "POSTGRES_PASSWORD=$dbPassword" -ForegroundColor White
Write-Host ""

# Copy to clipboard (optional)
$jwtSecret | Set-Clipboard
Write-Host "✅ JWT_SECRET copied to clipboard!" -ForegroundColor Green

