import { notifications } from '@mantine/notifications';
import FileWithProperties from '../types/FileWithProperties';

const postFile = (sessionId: string, { data, fileName, iv }: FileWithProperties) => {
  const formData = new FormData();

  formData.append('file', data);
  formData.append('baseName', fileName);
  formData.append('session', sessionId);
  formData.append('iv', iv);

  const url = `${import.meta.env.VITE_PB_URL as string}/api/collections/files/records`;
  const xhr = new XMLHttpRequest();

  xhr.open('POST', url, true);

  const notificationFileName = iv ? `${fileName} with encryption` : fileName;

  const notificationId = crypto.randomUUID();

  xhr.upload.onloadstart = () => {
    notifications.show({
      id: notificationId,
      loading: true,
      title: `Uploading ${notificationFileName}`,
      message: `Progress: 0%`,
      autoClose: false,
      withCloseButton: false,
    });
  };

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percentComplete = Math.round((e.loaded / e.total) * 100);
      notifications.update({
        id: notificationId,
        loading: true,
        title: `Uploading ${notificationFileName}`,
        message: `Progress: ${percentComplete}%`,
        autoClose: false,
        withCloseButton: false,
      });
    }
  };

  xhr.upload.onload = () => {
    notifications.update({
      id: notificationId,
      color: 'teal',
      title: `Uploaded ${notificationFileName}`,
      message: `${fileName} uploaded successfully`,
      autoClose: 5000,
    });
  };

  xhr.upload.onerror = () => {
    notifications.update({
      id: notificationId,
      color: 'red',
      title: `Failed to upload ${fileName}`,
      message: `Upload failed`,
      autoClose: 5000,
    });
  };

  xhr.send(formData);
};

export default postFile;
