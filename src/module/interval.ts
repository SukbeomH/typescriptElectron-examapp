import { getTaskList } from "./interval/killer";
import { detectMonitor } from "./interval/monitor";

export const intervalProcess = async (MonitorURL :string): Promise<void> => {
	// Get the task list && Detect the monitor
		await getTaskList();
		await detectMonitor(MonitorURL);
	setInterval(async () => {
		await getTaskList();
		await detectMonitor(MonitorURL);
	}, 13000);
};
