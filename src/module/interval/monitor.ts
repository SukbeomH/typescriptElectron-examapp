import { execSync } from "child_process";
import { BrowserWindow } from "electron";
import { app } from "electron";

// Get the number of displays
const getHardWareDisplays = () => {
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
		// excute the shell script to get the displays(powershell)
		const displays = execSync(
			`powershell.exe @(Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBasicDisplayParams).Length`
		);
		const displayNo = displays.toString();
		return Number(displayNo);
	}
};

// Get Display information and check if there are more than one display in every 10 seconds
export const detectMonitor = async (url) => {
	// get Monitors
	const monitors = getHardWareDisplays();
	// Check if there are more than one display
	if (monitors > 1) {
		const mainWindow = BrowserWindow.getFocusedWindow();
		await mainWindow.loadURL(url);
		setTimeout(() => {
			app.quit();
		}, 10000);
	}
	return;
};
