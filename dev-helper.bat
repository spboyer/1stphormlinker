@echo off
REM Helper script for 1st Phorm Linker Extension development

echo.
echo =====================================
echo  1st Phorm Linker Extension Helper
echo =====================================
echo.

echo This script helps you with common development tasks:
echo.
echo 1. Test the extension locally
echo 2. Create a release package
echo 3. View installation instructions
echo.

set /p choice="Enter your choice (1-3): "

if %choice%==1 goto test
if %choice%==2 goto package
if %choice%==3 goto instructions

:test
echo.
echo Testing the extension locally:
echo.
echo 1. Open Chrome or Edge
echo 2. Go to chrome://extensions/ or edge://extensions/
echo 3. Enable Developer Mode
echo 4. Click "Load unpacked" and select this folder
echo 5. Test on a 1st Phorm product page
echo.
pause
goto end

:package
echo.
echo Creating release package...
echo.
if exist "extension-package" rmdir /s /q "extension-package"
mkdir extension-package
copy manifest.json extension-package\
copy popup.html extension-package\
copy popup.js extension-package\
copy content.js extension-package\
copy content.css extension-package\
copy README.md extension-package\
copy 1stphormlinker.png extension-package\
xcopy icons extension-package\icons\ /E /I
xcopy images extension-package\images\ /E /I

echo.
echo Package created in "extension-package" folder
echo You can now zip this folder for distribution
echo.
pause
goto end

:instructions
echo.
echo Installation Instructions:
echo.
echo 1. Download the latest release from GitHub
echo 2. Extract the zip file
echo 3. Open Chrome/Edge and go to extensions page
echo 4. Enable Developer Mode
echo 5. Click "Load unpacked" and select the extracted folder
echo 6. Enter your affiliate code in the extension popup
echo.
pause
goto end

:end
echo.
echo Thank you for using the 1st Phorm Linker Extension!
echo.
