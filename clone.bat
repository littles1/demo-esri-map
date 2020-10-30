@ECHO OFF

SET "DIR=%~dp0"
SET "PACKAGE_NAME=package"
SET "APP_NAME=app"

ECHO Installing packages...

CALL :GetRepo "package"
CALL :GetRepo "app"

ECHO FINISHED!

EXIT /B 0

:GetRepo
REM Make sure the clone doesn't error out
CALL git clone https://[URL]/%~1
CALL CD %~1
CALL npm install
IF /I %~1==%PACKAGE_NAME% (
    CALL npm link
)
IF /I %~1==%APP_NAME% (
    CALL npm link "%APP_NAME%" 
)
CALL CD ..
EXIT /B 0
