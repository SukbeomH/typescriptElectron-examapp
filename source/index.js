const {
	app,
	BrowserWindow,
	globalShortcut,
	screen,
  dialog,
  systemPreferences
} = require('electron');

const path = require('path');
const find = require('find-process');
const si = require('systeminformation');

const SITE_URL = "https://sk-apply.insahr.co.kr/";
const COMPANY_CODE = "";
const LOGOUT_URL = "logout";
const CHEAT_URL = "cheat";

const CPU_CNT = 2;  //듀얼 코어 이상
const RAM_SIZE = 4000000000;  //4GB RAM 이상
const HW_TITLE = '프로그램 시작 오류';
const HW_MESSAGE = '시스템 사양이 요구 조건에 충족되지 않습니다. \nCPU: 듀얼코어 이상, RAM: 8GB 이상에서 만 작동됩니다.';

//부정행위 처리 모니터 개수 변경(테스트 진행시 편의를 위해)
//기본 세팅값: 1, 테스트 진행시: 2
const DISPLAY_CNT = 1;

const KILL_APP_LIST = [
  "alcapture","allcap","ancamcorder","ancamera5","atmgr","band","bandicamera","bdcam","bdcam_nonadmin","bdcam_safemode",
  "between","bindersys.richscan","calculator","camtasiastudio","capsun","capture-it","capturekkul","captureplus",
  "ciscowebexstart","copyman","dacapture","darkcapture","debut","discord","drcapture","dscorder","easeus recexperts",
  "easycapture","ecapture","excel","ezvid","facebookmessenger","flashback recorder","fraps","freecam","freecapture",
  "freecapturerf","fscapture","gomcam","greenshot","hancapture","hancaptureplus","hardcopy pro","honeycam","hprsnap5",
  "hprsnap6","hprsnap7","hprsnap8","hwp","icapture","i-pro5","kakaotalk","kalmuri","lightshort","line","linelauncher",
  "litecam","monosnap","mspaint","mstsc","mwsnap","nateon","nemojit","notepad","notion","obs64","ocam","ocamtask",
  "ohsoft","online screen recorder","outlook","paintshot","paletteimage","photopad","photoscape","picpick","powerpnt",
  "prtsc","ptinst","ptoneclk","ptsrv","quickassist","readygoscreenrecorder","recorder","scanitto","scapture","screen2avi",
  "screenhunter","screenshot","screensketch","sd_snap","sharex","shocksnap","skype","slack","smallcam","smartcapture",
  "smm_hypercam","snagit","snipaste","snippingtool","ssamnote","stylecapture","teams","teamviewer","teamviewer_service",
  "telegram","u3dedit3","ucapture","usnappro","web image extractor","webex","webexmta","wechatapp","wescreencapture",
  "whatsapp","whitecapture","wingcam","winword","wmrecorder","wondershare filmora9","wordpad","wwcam","youcam9","zoom",
  "quicktimeplayer","screencapture","snap_camera","wine","zoom.us"
];

let timerID;
let win;

const createWindow = () => {
  win = new BrowserWindow({
    // width: 800,
    // height: 600,
    fullscreen: true,
    frame: false,
    webPreferences: {
        nodeIntegrationInWorker: true,
        preload: path.join(__dirname, "preload.js"),
    },
  });

  //맥에서 화면전환하는 제스쳐를 막을 수 있음
  win.setKiosk(true);
  // win.setContentProtection(true) 인 경우 외부 어플리케이션에 의해 캡쳐되는 것을 막기 때문에 응용프로그램 화면공유가 안되고 바탕화면이 공유됨
  if (process.platform === 'darwin') {
    //맥은 문제없음
    win.setContentProtection(true);
  } else {
    win.setContentProtection(false);
  }
  win.setAlwaysOnTop(true);
  
  // win.webContents.openDevTools()  //랜더러에서 console창 보여주기
  //win.loadURL(`file://${__dirname}/index.html`);
  win.loadURL(SITE_URL + COMPANY_CODE);
  
  win.on('blur', function() {
    // console.log('blur event')
    // 모니터 및 실행금지 프로그램 감지
    runSecurity();
  })

  //현재 URL을 캐치
  win.webContents.on("did-stop-loading", () => {
    const url = win.webContents.getURL();
		const endpoint = url.split("/").pop();

    if (endpoint === LOGOUT_URL) {
      setTimeout(() => {
				app.quit();
			}, 1000);
    }
  });
  
  screen.on('display-removed', (event, display) => {
    // console.log('display-removed');
    // 모니터 및 실행금지 프로그램 감지
    runSecurity();
  });

  screen.on('display-added', (event, display) => {
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
}

app.whenReady().then(async () => {
  const cpuData = await si.cpu();
  const ramData = await si.mem();
  let systemResult = false;

  //듀얼코어 RAM 4GB이상만 실행가능
  if (cpuData.cores < CPU_CNT || ramData.total < RAM_SIZE) {
    systemResult = false;
  } else {
    systemResult = true;
  }
  
  if (systemResult) {
    
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
				"PrintScreen",
				"CommandOrControl+Shift+1",
				"CommandOrControl+Shift+2",
				"CommandOrControl+Shift+3",
				"CommandOrControl+Shift+4",
				"CommandOrControl+Shift+5",
			],
			() => {
				return false;
			}
		);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    })

  } else {
    dialog.showMessageBoxSync({
      title: HW_TITLE,
      message: HW_MESSAGE,
    });
    app.quit();
  }
})

//화면공유 설정
app.commandLine.appendSwitch("use-fake-ui-for-media-stream");

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 앱이 종료가 되면서 앱의 모든 윈도우를 닫기 시작 전에 발생하는 이벤트입니다.
app.on('before-quit', (event) => {
  // 이 이벤트는 이미 닫혀있어도 불립니다.
  // event.preventDefault() 를 호출하면 기본 동작인 어플리케이션 종료를 하지 않습니다.
  clearInterval(timerID);
  globalShortcut.unregisterAll();
});

const detectMonitor = () => {
	const displays = screen.getAllDisplays();
	if (displays.length > DISPLAY_CNT) {
    clearInterval(timerID);
    win.loadURL(SITE_URL + CHEAT_URL);
	} else {
    killAppProcess();
  }
};

const killAppProcess = () => {
  //계속해서 실행중인 프로세스를 감시할지 여부
  let isDetectRunProcess = false;

  //실행중인 프로세램 전체를 받아온다
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

    //실행방지 프로그램이 감지되지 않았다면, 타이머 종료
    if (isDetectRunProcess === false) {
      clearInterval(timerID);
      //console.log('미감지');
    }
  })
}

const runSecurity = () => {
  if (screen.getAllDisplays().length > DISPLAY_CNT) {
    const url = win.webContents.getURL();
		const endpoint = url.split("/").pop();

    if (endpoint !== CHEAT_URL) {
      //경고 페이지로 이동
      win.loadURL(SITE_URL + CHEAT_URL);
    }
  }else{
    //blur이벤트로 여러번 실행될수 있어서 한번만 실행되게
    clearInterval(timerID);
    //모니터가 1개 일 경우 타이머 실행
    timerID = setInterval(detectMonitor, 5000);
  }
}