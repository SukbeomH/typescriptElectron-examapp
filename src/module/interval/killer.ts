import find from "find-process";
import { killList } from "./killList";
import { exec } from "child_process";

// Terminate Processes divided by OS
const killWindows = (appName: string): Promise<void> => {
	exec(`TASKKILL /IM ${appName}.exe /F`);
	return;
};
const killMac = (appName: string): Promise<void> => {
	exec(`killall ${appName}`);
	return;
};

// Get Tasklist divided by OS And Kill
export const getTaskList = async (): Promise<void> => {
	const appList:{
    pid: number;
    name: string;
    cmd: string;
	}[] = await find("name", "");	
	const existApp: string[] = [];
	for (let app of appList) {
		existApp.push(app.name.replace(".exe", ""));
	}
	const killSet: string[] = [...new Set(existApp)];

	killList.forEach((listItem) => {
		killSet.forEach((killItem) => {
			if (
				listItem == killItem &&
				process.platform === "win32"
			) {
				killWindows(listItem);
			} else if (
				listItem == killItem &&
				process.platform === "darwin"
			) {
				killMac(listItem);
			}
		});
	});
};
