import { execSync } from "child_process";
import { dialog, app, MessageBoxReturnValue } from "electron";
import { getSystemVersion, getSystemMemoryInfo } from "process";
import { updateManager } from "./updater";

export const getSystemInfo = async (): Promise<boolean> => {
	const checked:boolean = await updateManager().then(async (): Promise<boolean> => {
		// Check System info
		const systemMemory: number = Number((Number(getSystemMemoryInfo().total) / 10e5).toFixed(2));
		if (process.platform === "darwin") {
			const systemVersion: number = Number(getSystemVersion());
			const systemData: string = execSync(`system_profiler SPHardwareDataType -json`).toString();
			// parse the data
			const parsedSystemData = JSON.parse(systemData);
			const cpuData: string = parsedSystemData.SPHardwareDataType[0].number_processors;
			const core: number = Number(cpuData.split(" ")[1].split(":")[0]);
			// if memory is less than 4GB or System version is below Sierra, return Dialog
			if (systemMemory <= 3) {
				const { response }: MessageBoxReturnValue = await dialog.showMessageBox({
					type: "error",
					title: "[프로그램 실행 불가]",
					message: `최소 사양 기준 이상의 PC로 교체하여\n진행해 주세요.`,
					detail:
						`[내 PC 사양]\n
					- 시스템: OS X ${systemVersion}\n
					- CPU 코어: ${core} Core\n
					- 메모리 (RAM): ${systemMemory} GB\n
					\n
					[최소 사양]\n	
					- 시스템: OS X 10.12\n	
					- CPU 코어: 4 Core 이상\n
					- 메모리 (RAM): 4 GB 이상`,
					buttons: ["종료"],
				})
				if (response === 0) {
					app.quit();
					return false;
				}
			}
			return true;
		} else if (process.platform === "win32") {
			const systemVersion: number = Number(getSystemVersion().split(".")[0]);
			// if memory is less than 4GB or System version is below Windows10, return Dialog
			const core: number = Number(execSync('wmic cpu get NumberOfCores').toString().split('\n')[1].trim())
			const thread: number = Number(execSync('wmic cpu get NumberOfLogicalProcessors').toString().split('\n')[1].trim())
			if (core <= 2 || thread <= 3 || systemMemory <= 3 || systemVersion < 10) {
				const { response }: MessageBoxReturnValue = await dialog.showMessageBox({
					type: "error",
					title: "[프로그램 실행 불가]",
					message: `최소 사양 기준 이상의 PC로 교체하여\n진행해 주세요.`,
					detail:
						`[내 PC 사양]\n
					- 시스템: Windows ${systemVersion}\n
					- CPU 코어: ${core} Core\n
					- CPU 스레드: ${thread} thread\n
					- 메모리 (RAM): ${systemMemory} GB\n
					\n
					[최소 사양]\n	
					- 시스템: Windows 10\n	
					- CPU 코어: 4 Core 이상\n
					- CPU 스레드: 4 thread 이상\n
					- 메모리 (RAM): 4 GB 이상`,
					buttons: ["종료"],
				})
				if (response === 0) {
					app.quit();
					return false;
				}
			}
			return true;
		}
	})
	return checked;
};
