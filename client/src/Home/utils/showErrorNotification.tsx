import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

const showErrorNotification = (
  id: string,
  title: string,
  message: string,
  autoClose: number | boolean
) => {
  notifications.show({
    id,
    withCloseButton: true,
    autoClose,
    title,
    message,
    color: 'red',
    icon: <IconX />,
    loading: false,
  });
};

export default showErrorNotification;
