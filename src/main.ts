// Modules to control application life and create native browser window
import { app, BrowserWindow, desktopCapturer, globalShortcut, dialog } from "electron";
import { mediaAccess } from "./module/mediaAccess";
import { getSystemInfo } from "./module/system";
import { getPlatform, property } from "./properties";
import { ProgressInfo, autoUpdater } from "electron-updater";
let firstTimer: NodeJS.Timeout;
import { getTaskList } from "./module/interval/killer";
import { detectMonitor } from "./module/interval/monitor";

const { url, code, exit, cheat } = property.SK_PLATFORM;

let browserWindowConstructorOptions: Electron.BrowserWindowConstructorOptions
const urlPath: string = url.split("//")[1].split(".")[0];
if (urlPath !== "pt") {
	browserWindowConstructorOptions = {
		width: 800,
		height: 600,
		fullscreen: true,
		frame: false,
		titleBarStyle: "hidden",
		kiosk: true,
		alwaysOnTop: true,
		type: "screen-saver",
		resizable: false,
		movable: false,
		webPreferences: {
			devTools: false,
			// devTools: true,
			allowRunningInsecureContent: true,
			webSecurity: false,
			defaultEncoding: "UTF-8",
			webviewTag: true,
			spellcheck: false,
			backgroundThrottling: false,
			nodeIntegration: true,
			nodeIntegrationInWorker: true,
		},
	};
} else {
	browserWindowConstructorOptions = {
		width: 800,
		height: 600,
		// fullscreen: true,
		// frame: false,
		// titleBarStyle: "hidden",
		// kiosk: true,
		// alwaysOnTop: true,
		// type: "screen-saver",
		// resizable: false,
		// movable: false,
		webPreferences: {
			devTools: false,
			// devTools: true,
			allowRunningInsecureContent: true,
			webSecurity: false,
			defaultEncoding: "UTF-8",
			webviewTag: true,
			spellcheck: false,
			backgroundThrottling: false,
			nodeIntegration: true,
			nodeIntegrationInWorker: true,
		},
	};
}

let createdWindow: BrowserWindow;

async function createWindow() {
	// Create the browser window.
	const mainWindow: BrowserWindow = new BrowserWindow(browserWindowConstructorOptions);
	// and load the URL
	await mainWindow.loadURL(url + code);

	// Prevent the Alt + Tab
	mainWindow.setMenu(null);
	mainWindow.setMenuBarVisibility(false);
	mainWindow.setAutoHideMenuBar(true);

	// Clearing the cache
	await mainWindow.webContents.session.clearStorageData();
	await mainWindow.webContents.session.clearCache();

	if (process.platform === "darwin") {
		mainWindow.setTouchBar(null);
		mainWindow.setContentProtection(true);
		mainWindow.webContents.session.setDisplayMediaRequestHandler(
			(_request, callback) => {
				desktopCapturer
					.getSources({ types: ["screen"] })
					.then((sources) => {
						// Grant access to the first screen found.
						callback({ video: sources[0] });
					})
					.catch((err) => {
						console.log(err);
					});
			}
		);
	} else if (process.platform === "win32") {
		mainWindow.setContentProtection(false);
		mainWindow.webContents.session.setDisplayMediaRequestHandler(
			(_request, callback) => {
				desktopCapturer
					.getSources({ types: ["screen"] })
					.then((sources) => {
						// Grant access to the first screen found.
						callback({ video: sources[0] });
					})
					.catch((err) => {
						console.log(err);
					});
			}
		);
	}

	// Camera, Microphone Access Question
	await mediaAccess();

	// Check the update
	await autoUpdater.checkForUpdates();
	// Create Progress Bar for the autoUpdater
	autoUpdater.on("download-progress", (progressObj: ProgressInfo) => {
		mainWindow.setProgressBar(progressObj.percent / 100);
	});
	autoUpdater.on("update-downloaded", () => {
		autoUpdater.quitAndInstall();
	}); 

	createdWindow = mainWindow;
}

app.removeAllListeners('ready');

// When the app is ready
app
	.whenReady()
	.then(async () => {
		// Validate the system information
		await getSystemInfo().then((res:boolean): void => { 
			if (!res) app.quit();
		});
		// Create the window
		await createWindow();

		// Register a keyboard shortcut to quit the app
		globalShortcut.register("Command+Q", (): void => {
			app.quit();
		});
		// For Windows
		globalShortcut.register("Alt+F4", (): void => {
			app.quit();
		});
		globalShortcut.register("Ctrl+F3", async (): Promise<void> => {
			const currentVersion: string = app.getVersion();
			const latestVersion: string = (await autoUpdater.checkForUpdates()).updateInfo.version;
			// Create Dialog, shows the current screen size
			const window: BrowserWindow = BrowserWindow.getFocusedWindow()
			window.maximize();
			dialog.showMessageBox(window, {
				title: "Screen Status",
				message:
					`Version: ${currentVersion}\n
					Latest Version: ${latestVersion}\n
				Full Screen: ${window.isFullScreen().toString()}\n
				Kiosk: ${window.isKiosk().toString()}\n
				Maximized: ${window.isMaximized().toString()}\n
				Visible: ${window.isVisible().toString()}\n
				Always On Top: ${window.isAlwaysOnTop().toString()}\n
				Movable: ${window.isMovable().toString()}\n
				Resizable: ${window.isResizable().toString()}\n
				Closable: ${window.isClosable().toString()}\n
				Enabled: ${window.isEnabled().toString()}\n
				Focusable: ${window.isFocusable().toString()}\n`,
				buttons: ["OK"],
			});
		});
	});

app.on("activate", async () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		// await getSystemInfo().then(async () => {
		// 	await createWindow();
		// });
	}
});

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});

let Idx: number = 1;
// // 프로그램 시작 후 즉시 실행 (5회, 0.5초 간격)
while (Idx < 2000) {
	if (Idx === 5) {
		clearTimeout(firstTimer);
	}
	// let monitorTimer: NodeJS.Timeout = null;
	if (Idx > 5) {
		setTimeout(async() => {
			await getTaskList();
			const checkMonitor = (): void => {
				// monitorTimer =
					setTimeout(async () => {
					await detectMonitor(url + cheat, createdWindow);
					console.log("detectMonitor");
				}, 25000);
			};
			checkMonitor();
			// if (monitorTimer !== null) {
			// 	clearTimeout(monitorTimer);
			// }
		}, Idx * 15000);
	}
	Idx++;
	if (Idx < 5) {
		firstTimer = setTimeout(async () => {
			let window = BrowserWindow.getFocusedWindow();
			await getTaskList();
			await detectMonitor(url + cheat, createdWindow)
		}, 500 * Idx);
	}
}

app.on("browser-window-focus", () => {
	let window = BrowserWindow.getFocusedWindow();
	// Get the current URL When the url is changed
	window.webContents.on("did-stop-loading", () => {
		const endpoint: string = window.webContents.getURL().split("/").pop();
		if (endpoint === exit) {
			setTimeout(() => {
				app.quit();
			}, 3000);
			return;
		}
	});
});
