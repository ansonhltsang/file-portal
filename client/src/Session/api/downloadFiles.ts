import base64ToUint8Array from '../utils/base64ToUint8Array';
import showErrorNotification from '../../Home/utils/showErrorNotification';
import FileItem from '../types/FileItem';

const downloadFiles = async (
  selectedFiles: Array<string>,
  files: Array<FileItem>,
  clientKey: CryptoKey | null
) => {
  const pbUrl = import.meta.env.VITE_PB_URL as string;

  await Promise.all(
    selectedFiles.map(async (fileId) => {
      const file = files.find((f) => f.id === fileId);
      if (file === undefined) {
        return;
      }
      const url = `${pbUrl}/api/files/files/${fileId}/${file.serverName}?download=1`;

      try {
        const response = await fetch(url);

        if (response.status !== 200) {
          return;
        }

        const encryptedDataAsBlob = await response.blob();
        let data = encryptedDataAsBlob;

        if (file.iv && clientKey !== null) {
          const iv = base64ToUint8Array(file.iv);
          const encryptedData = await encryptedDataAsBlob.arrayBuffer();
          data = new Blob([
            await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, clientKey, encryptedData),
          ]);
        }

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(data);
        downloadLink.download = file.name;

        document.body.appendChild(downloadLink);
        downloadLink.click();

        setTimeout(() => {
          URL.revokeObjectURL(downloadLink.href);
          document.body.removeChild(downloadLink);
        }, 100);
      } catch (error) {
        showErrorNotification(
          'failed-download',
          'Download failed',
          `Failed to download ${file.name}`,
          5000
        );
      }
    })
  );
};

export default downloadFiles;
