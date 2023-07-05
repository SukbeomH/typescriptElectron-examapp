import { dialog } from "electron";
import { UpdateCheckResult, autoUpdater } from "electron-updater";

export const updateManager = async (): Promise<boolean> => {
  const updateStatus: UpdateCheckResult = await autoUpdater.checkForUpdates();
  dialog.showMessageBox({
    type: "info",
    title: "업데이트 확인",
    message: `${updateStatus.updateInfo.version} 버전이 확인되었습니다.\n
    ${updateStatus.updateInfo}`,
    buttons: ["확인"],
  }).then(({response}) => {
    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
    return false;
  })
  return true;
}