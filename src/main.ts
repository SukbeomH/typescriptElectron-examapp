// Modules to control application life and create native browser window
import { app, BrowserWindow, desktopCapturer, globalShortcut, dialog } from "electron";
import { mediaAccess } from "./module/mediaAccess";
import { getSystemInfo } from "./module/system";
import { intervalProcess } from "./module/interval";
import 'dotenv/config'
import { getPlatform } from "./properties";

const { url, code, exit, cheat } = getPlatform("KT");

async function createWindow() {
	// Create the browser window.
	const mainWindow: BrowserWindow = new BrowserWindow({
		width: 800,
		height: 600,
		fullscreen: true,
		frame: false,
		titleBarStyle: "hidden",
		kiosk: true,
		webPreferences: {
			allowRunningInsecureContent: true,
			webSecurity: false,
			defaultEncoding: "UTF-8",
			webviewTag: true,
			spellcheck: false,
		},
	});
	// and load the URL
	await mainWindow.loadURL(url + code);

	// Prevent the Alt + Tab
	mainWindow.setAlwaysOnTop(true, "screen-saver");
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

	// Get the current URL When the url is changed
	mainWindow.webContents.on("did-stop-loading", () => {
		const url: string = mainWindow.webContents.getURL();
		const endpoint = url.split("/").pop();
		if (endpoint === exit) {
			setTimeout(() => {
				app.quit();
			}, 3000);
			return;
		}
	});

	// Acquire the camera and microphone permission
	mainWindow.webContents.session.setPermissionCheckHandler(() => true);
	mainWindow.webContents.session.setPermissionRequestHandler(
		(_webContents, _permission, callback) => callback(true)
	);
	mainWindow.webContents.session.setDevicePermissionHandler(() => true);
	// Camera, Microphone Access Question
	await mediaAccess();
}

app.commandLine.appendSwitch('disable-gpu');

// When the app is ready
app
	.whenReady()
	.then(async () => {
		// Validate the system information
		await getSystemInfo().then((res:boolean) => {
			if (!res) app.quit();
		});
		// Create the window
		await createWindow()
			.then(async () => {
				await intervalProcess(url + cheat);
			})
			.catch((err) => {
				console.log(err);
			});
		// Disable the keyboard shortcuts
		globalShortcut.unregisterAll();
		// Register a keyboard shortcut to quit the app
		globalShortcut.register("Command+Q", () => {
			app.quit();
		});
		// For Windows
		globalShortcut.register("Alt+F4", () => {
			app.quit();
		});
		globalShortcut.register("Alt+Tab", () => {
			// disable the Alt + Tab
			app.focus();
		});
		globalShortcut.register("Ctrl+F1", () => {
			// Create Dialog, shows the current screen size
			const window: BrowserWindow = BrowserWindow.getFocusedWindow()
			window.maximize();
			dialog.showMessageBox(window, {
				title: "Screen Status",
				message:
					`Full Screen: ${window.isFullScreen().toString()}\n
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
		})
	})
app.on("activate", async function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		await getSystemInfo().then(async () => {
			await createWindow();
		});
	}
});

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});
