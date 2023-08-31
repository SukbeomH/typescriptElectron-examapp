import { BrowserWindow } from "electron";
import { getTaskList } from "./interval/killer";
import { detectMonitor } from "./interval/monitor";

export const intervalProcess = async (MonitorURL: string, window: BrowserWindow): Promise<void> => {
	const url: string = MonitorURL.split("//")[1].split(".")[0];
	if (url == 'pt') {
		return;
	}
	// Get the task list && Detect the monitor
	await getTaskList();
	await detectMonitor(MonitorURL, window);
	setInterval(async () => {
		await getTaskList();
	}, 11000);
	setInterval(async () => {
		await detectMonitor(MonitorURL, window)
	}, 35000);
};

