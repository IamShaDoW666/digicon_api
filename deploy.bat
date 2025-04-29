@echo off
REM Deploy Next.js App with Prisma - Standalone Build

REM Step 6: Copy the prisma folder to .next/standalone/
echo Copying prisma folder to .next/standalone/...
xcopy /E /I /Y prisma .next\standalone\prisma

REM Step 7: Create the .next/standalone/public/_next directory
echo Creating .next/standalone/public/_next directory...
mkdir ".next\standalone\public\_next"

REM Step 8: Copy .next/static to .next/standalone/public/_next/
echo Copying .next/static to .next/standalone/public/_next/...
xcopy /E /I /Y ".next\static" ".next\standalone\public\_next\static"

echo Deployment completed successfully.
pause
