import { app, BrowserWindow, globalShortcut, screen, dialog, systemPreferences } from 'electron';
import { ProgressInfo, UpdateCheckResult, autoUpdater } from "electron-updater";
import path from 'path';
import find from 'find-process';
import si from 'systeminformation';
import { property } from './properties';
import { KILL_APP_LIST } from './killList';
import { execSync } from 'child_process';

// Get Platform from properties.ts
const { url, code, exit, cheat } = property.CJ_PLATFORM;

// 허용할 모니터 갯수 (ex. 기본 세팅값: 1, 테스트 진행시: 2)
const DISPLAY_CNT = 1;

// 전역 변수로 윈도우 객체를 유지합니다.
let win: BrowserWindow;

// 타이머 ID 저장 변수
let timerID: NodeJS.Timeout;

const createWindow = () => {
  win = new BrowserWindow({
    // width: 800,
    // height: 600,
		fullscreen: true,
		frame: false,
		titleBarStyle: "hidden",
		alwaysOnTop: true,
		type: "screen-saver",
		resizable: false,
		movable: false,
    // 맥에서 화면전환하는 제스쳐를 막을 수 있음
		kiosk: true,
    webPreferences: {
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, "preload.js"),
      defaultEncoding: "UTF-8",
      spellcheck: false,
      backgroundThrottling: false,
      devTools: false,
      // v8CacheOptions: "code",
    },
  });
	win.setMenu(null);
	win.setMenuBarVisibility(false);
  win.setAutoHideMenuBar(true);
  win.removeMenu();

  // win.setContentProtection(true) 인 경우 외부 어플리케이션에 의해 캡쳐되는 것을 막기 때문에 응용프로그램 화면공유가 안되고 바탕화면이 공유됨
  if (process.platform === 'darwin') {
		win.setTouchBar(null);
    win.setContentProtection(true);
  } else {
    win.setContentProtection(false);
  }
  
  // win.webContents.openDevTools()

  win.loadURL(url + code);
  
  // 창이 포커스를 잃었을 때 발생하는 이벤트
  win.on('blur', function() {
    // console.log('blur event')
    // 모니터 및 실행금지 프로그램 감지
    runSecurity();
  })

  // 현재 URL을 캐치
  win.webContents.on("did-stop-loading", () => {
    const url = win.webContents.getURL();
		const endpoint = url.split("/").pop();

    if (endpoint === exit) {
      setTimeout(() => {
				app.quit();
			}, 3000);
    }
  });
  
  screen.on('display-removed', (_event, _display) => {
    // console.log('display-removed');
    // 모니터 및 실행금지 프로그램 감지
    runSecurity();
  });

  screen.on('display-added', (_event, _display) => {
    // console.log('display-added');
    // 모니터 및 실행금지 프로그램 감지
    runSecurity();
  });

  if (process.platform === "darwin") {
    systemPreferences.askForMediaAccess('microphone');
    systemPreferences.askForMediaAccess('camera');
  }

  // const { type, versions } = process;
  // console.log(`process type : ${type}`);
  // console.log(`process version : ${JSON.stringify(versions)}`);
  // console.log(process.platform);

	// Check the update
  autoUpdater.checkForUpdates().then((result: UpdateCheckResult) => {
    // Create Progress Bar for the autoUpdater
    autoUpdater.on("download-progress", (progressObj: ProgressInfo) => {
      win.setProgressBar(progressObj.percent / 100);
    });
    autoUpdater.on("update-downloaded", () => {
      autoUpdater.quitAndInstall();
    });
  }).catch((err) => {
    console.log(err);
  });
}

app.whenReady().then(async () => {
  const requiredCore: number = 4;
  const requiredThread: number = 4;
  const requiredMemory: number = 4;
  const requiredVersion: number = 10;

  const systemVersion = Number((await si.osInfo()).release.split('.')[0]);
  const systemCore: number = (await si.cpu()).physicalCores;
  const systemThread: number = (await si.cpu()).cores;
  const systemMemory: number = Math.floor((await si.mem()).total / 1024 ** 3);

  let systemVersionMsg: string = '';
  let requiredVersionMsg: string = '';

  let systemResult: boolean = false;

  // 듀얼코어 && RAM 4GB이상 && 윈도우10 이상만 실행가능
  if (
    systemCore < requiredCore
    || systemThread < requiredThread
    || systemMemory < requiredMemory
    || systemVersion < requiredVersion
  ) {
    systemResult = false;
  } else {
    systemResult = true;
  }
  // OS 버전에 따라서 메시지 변경 (윈도우, 맥)
  if (process.platform === "win32") {
    systemVersionMsg = `Windows ${systemVersion}`;
    requiredVersionMsg = `Windows ${requiredVersion}`;
  } else if (process.platform === "darwin") {
    systemVersionMsg = `MacOS ${systemVersion}`;
    requiredVersionMsg = `MacOS ${requiredVersion}`;
  }
  
  if (systemResult) {
    // console.log('시스템 요구사항 충족');
    createWindow();
    
    // 모니터 및 실행금지 프로그램 감지
    runSecurity();
    
    // Disable the Function keys
		globalShortcut.registerAll(
			[
				"CommandOrControl+R",
				"CommandOrControl+Shift+R",
				"CommandOrControl+C",
        "CommandOrControl+V",
        "CommandOrControl+S",
        "PrintScreen",
        "F11",
				"CommandOrControl+Shift+1",
				"CommandOrControl+Shift+2",
				"CommandOrControl+Shift+3",
				"CommandOrControl+Shift+4",
        "CommandOrControl+Shift+5",
        "Alt+Tab",
        "Alt+Shift+Tab",
        "CommandOrControl+Tab",
        "Control+Alt+Delete",
        "Option+Command+Esc",
        "Option+Command+I",
        "Option+Command+U",
        "Option+Command+J",
			],
			() => {
				return false;
			}
		);

    // 활성 상태에서 창이 없을 경우 새 창을 만듭니다.
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    })

  } else {
    const response: number = dialog.showMessageBoxSync({
      type: "error",
      title: "[프로그램 실행 불가]",
      message: `최소 사양 기준 이상의 PC로 교체하여\n진행해 주세요.`,
      detail:
        `[내 PC 사양]\n
      - 시스템: ${systemVersionMsg}\n
      - CPU 코어: ${systemCore} Core\n
      - CPU 스레드: ${systemThread} thread\n
      - 메모리 (RAM): ${systemMemory} GB\n
      \n
      [최소 사양]\n	
      - 시스템: ${requiredVersionMsg} 이상\n
      - CPU 코어: ${requiredCore} Core 이상\n
      - CPU 스레드: ${requiredThread} thread 이상\n
      - 메모리 (RAM): ${requiredMemory} GB 이상\n`,
      buttons: ["종료"],
    });
    if (response === 0) {
      app.quit();
    }
  }
})

// 화면공유 설정
app.commandLine.appendSwitch("use-fake-ui-for-media-stream");

// 모든 창이 닫히면 종료합니다. (맥에서는 제외)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 앱이 종료가 되면서 앱의 모든 윈도우를 닫기 시작 전에 발생하는 이벤트입니다.
app.on('before-quit', (_event) => {
  // 이 이벤트는 이미 닫혀있어도 불립니다.
  // event.preventDefault() 를 호출하면 기본 동작인 어플리케이션 종료를 하지 않습니다.
  clearInterval(timerID);
  globalShortcut.unregisterAll();
});

// 모니터 감지
const detectMonitor = () => {
  const displays = screen.getAllDisplays();
  const displaysCMD = getHardWareDisplays();
  // 기준치 보다 모니터가 많아지면 경고페이지로 이동
	if (displays.length > DISPLAY_CNT || displaysCMD > DISPLAY_CNT) {
    clearInterval(timerID);
    win.webContents.loadURL(url + cheat);
  } else {
    // 실행중인 프로그램 감지
    killAppProcess();
  }
};

const killAppProcess = () => {
  // 계속해서 실행중인 프로세스를 감시할지 여부
  let isDetectRunProcess = false;

  // 실행중인 프로세스의 전체 리스트를 받아온다
  find('name', '')
  .then((list) => {
    KILL_APP_LIST.forEach((pName) => {
      const findApp = list.filter(row => (row.name.toLowerCase() === pName.toLowerCase()) || (row.name.toLowerCase().endsWith('.exe') && row.name.toLowerCase().slice(0, -4) === pName.toLowerCase()))
      if (findApp.length > 0) {
        isDetectRunProcess = true;
        findApp.forEach((proc) => {
          // 실행중인 프로그램 강제종료
          process.kill(proc.pid);
        });
      }
    })

    // 실행방지 프로그램이 감지되지 않았다면, 타이머 종료
    if (isDetectRunProcess === false) {
      clearInterval(timerID);
      // console.log('미감지');
    }
  })
}

// 모니터 및 실행금지 프로그램 감지
const runSecurity = () => {
  killAppProcess();
  const displays = screen.getAllDisplays().length;
  const displaysCMD = getHardWareDisplays();
  if (displays > DISPLAY_CNT || displaysCMD > DISPLAY_CNT) {
    const clientURL = win.webContents.getURL();
    const endpoint = clientURL.split("/").pop();
    // url + cheat 페이지가 아니면 경고 페이지로 이동
    if (endpoint !== cheat) {
      //경고 페이지로 이동
      win.webContents.loadURL(url + cheat);
    }
  }else{
    //blur이벤트로 여러번 실행될수 있어서 한번만 실행되게
    clearInterval(timerID);
    //모니터가 1개 일 경우 타이머 실행
    timerID = setInterval(detectMonitor, 5000);
  }
}

const getHardWareDisplays = (): number => {
  if (process.platform === "darwin") {
  // execute the shell script to get the displays
  const displays = execSync(
    `system_profiler SPDisplaysDataType -json`
  ).toString();
  // parse the displays
  const parsedDisplays = JSON.parse(displays);
  // spdisplays_ndrvs number is the number of displays
  const numberOfDisplays =
    parsedDisplays.SPDisplaysDataType[0].spdisplays_ndrvs
      .length;
  return Number(numberOfDisplays);
} else if (process.platform === "win32") {
  // execute the shell script to get the displays(cmd)
  const displayCMD = Number(execSync(
    `for /F %M in ('wmic path Win32_PnPEntity where "Service='monitor' and Status='OK'" get DeviceID /VALUE ^ ^| find /C "=" ') do echo %M`
  ));
  const displayPS = Number(execSync(
    `powershell.exe @(Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBasicDisplayParams).Length`
  ));
  // larger number is the number of displays
  const displays = displayCMD > displayPS ? displayCMD : displayPS;
  
  return displays;
}
};