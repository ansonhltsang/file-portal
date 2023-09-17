import { useRef } from 'react';
import { Text, Group, createStyles, rem } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import postFile from './api/postFiles';
import FileWithProperties from './types/FileWithProperties';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    marginBottom: rem(30),
  },

  dropzone: {
    borderWidth: rem(1),
    padding: rem(10),
    height: 'auto',
    width: rem('80vw'),
    maxWidth: rem(800),
    minWidth: rem(300),
  },

  dropzoneContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  icon: {
    color: theme.colors.gray[4],
  },

  control: {
    position: 'absolute',
    width: rem(250),
    left: `calc(50% - ${rem(125)})`,
    bottom: rem(-20),
  },
}));

type DropzoneContainerProps = {
  sessionId: string;
  clientKey: CryptoKey | null;
};

const processFile = (sessionId: string, file: FileWithPath, clientKey: CryptoKey | null) => {
  const reader = new FileReader();

  reader.onload = async (e) => {
    if (e.target === null) {
      throw new Error('Unable to encrypt file');
    }
    const data = e.target.result;

    if (data === null) {
      throw new Error('Unable to encrypt file');
    }

    if (typeof data === 'string') {
      throw new Error('File reader must read as array buffer');
    }

    if (clientKey !== null) {
      const iv = crypto.getRandomValues(new Uint8Array(16));
      const ivAsString = window.btoa(String.fromCharCode.apply(null, Array.from<number>(iv)));

      const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, clientKey, data);

      const encryptedFileToPost: FileWithProperties = {
        data: new Blob([encryptedData]),
        fileName: file.name,
        iv: ivAsString,
      };

      postFile(sessionId, encryptedFileToPost);
    } else {
      const fileToPost: FileWithProperties = {
        data: new Blob([data]),
        fileName: file.name,
        iv: '',
      };
      postFile(sessionId, fileToPost);
    }
  };

  reader.readAsArrayBuffer(file);
};

export const DropzoneContainer = ({ sessionId, clientKey }: DropzoneContainerProps) => {
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null);

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={(files) => files.map((file) => processFile(sessionId, file, clientKey))}
        className={classes.dropzone}
        radius="md"
        maxSize={10 * 1024 ** 2}
      >
        <div className={classes.dropzoneContent} style={{ pointerEvents: 'none' }}>
          <Group position="center" className="h-fit mx-3">
            <Dropzone.Accept>
              <IconDownload
                size={rem(70)}
                color={theme.colors[theme.primaryColor][6]}
                stroke={1.2}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={rem(70)} color={theme.colors.red[6]} stroke={1.2} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload size={rem(70)} color={theme.black} stroke={1.2} />
            </Dropzone.Idle>
          </Group>
          <div className="flex-1">
            <Text ta="center" fw={700} fz="xl" mt="xl" my={0}>
              <Dropzone.Accept>Drop files here</Dropzone.Accept>
              <Dropzone.Reject>Files less than 10mb</Dropzone.Reject>
              <Dropzone.Idle>Upload files here</Dropzone.Idle>
            </Text>
            <Text ta="center" fz="sm" mt="xs" c="dimmed">
              Click here or drag and drop files to upload. Up to 10 MB.
            </Text>
          </div>
        </div>
      </Dropzone>
    </div>
  );
};
