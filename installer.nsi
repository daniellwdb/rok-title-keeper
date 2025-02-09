!include LogicLib.nsh

OutFile "Setup Roka.exe"

InstallDir $DESKTOP\Roka

RequestExecutionLevel User
ShowInstDetails Show

Section -Prerequisites
  SetOutPath $INSTDIR\Prerequisites
  File /a /r "prerequisites\"
SectionEnd
 
Section
  SetOutPath $INSTDIR
  File /a /r "dependencies\"
SectionEnd
 
Section
  SetOutPath $INSTDIR
  WriteUninstaller "$INSTDIR\Uninstall Roka.exe"

  nsExec::ExecToStack '"node" "--version"'
  Pop $0
  Pop $1
  ${If} $1 == ""
    MessageBox MB_OK "Your system does not appear to have Node.js installed.$\n$\nPress OK to install it."
    ExecWait 'msiexec /i "Prerequisites\node-v20.15.0-x64.msi"'
  ${EndIf}
  IfFileExists C:\tools\* endOpenCV beginOpenCV
  Goto endOpenCV
    beginOpenCV:
    MessageBox MB_OK "Your system does not appear to have OpenCV installed. Please enter C:\tools when prompted to enter a path."
    ExecWait "$INSTDIR\Prerequisites\opencv-4.6.0-vc14_vc15.exe"
    EnVar::SetHKCU
    EnVar::AddValue "OPENCV_BIN_DIR" "C:\tools\opencv\build\x64\vc14\bin"
    EnVar::AddValue "Path" "%OPENCV_BIN_DIR%"
  endOpenCV:
  
  ReadRegStr $0 HKLM64 Software\Microsoft\VisualStudio\14.0\VC\Runtimes\x64 ""
  ${If} $0 == ""
    ExecWait "$INSTDIR\Prerequisites\VC_redist.x64.exe"
  ${EndIf}

  MessageBox MB_OK "The Roka folder has been added to your desktop. Please do not move, delete or rename this folder."
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\Uninstall Roka.exe"
  RMDir /r C:\tools\OpenCV
  RMDir /r $INSTDIR
  EnVar::Delete "OPENCV_BIN_DIR"
  EnVar::DeleteValue "Path" "%OPENCV_BIN_DIR%"
  MessageBox MB_OK "Node.js and Microsoft Visual C++ Redistributable must be uninstalled manually."
SectionEnd
