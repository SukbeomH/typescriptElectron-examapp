import { getTaskList } from "./interval/killer";
import { detectMonitor } from "./interval/monitor";

export const intervalProcess = async (MonitorURL :string): Promise<void> => {
	// Get the task list && Detect the monitor
	await getTaskList();
	await detectMonitor(MonitorURL);
	setInterval(async (): Promise<void> => {
		await getTaskList();
		return;
	}, 61000);
	setInterval(async (): Promise<void> => {
		await detectMonitor(MonitorURL);
		return;
	}, 11000);
};
