import { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import { createStyles, Table, Checkbox, ScrollArea, rem, Button } from '@mantine/core';
import { IconTrashX, IconLockCheck, IconLockOff } from '@tabler/icons-react';
import getFileList from './api/getFileList';
import downloadFiles from './api/downloadFiles';
import deleteFile from './api/deleteFile';
import showErrorNotification from '../Home/utils/showErrorNotification';
import FileItem from './types/FileItem';
import fileSizeToReadableString from './utils/fileSizeToReadableString';

export type FileContainerProps = {
  sessionId: string;
  clientKey: CryptoKey | null;
};

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
  header: {
    position: 'sticky',
    zIndex: 2,
    top: 0,
    backgroundColor: theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${theme.colors.gray[2]}`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },

  downloadButton: {
    [theme.fn.smallerThan('md')]: {
      width: rem('80vw'),
    },
  },

  scrollAreaWrapper: {
    height: rem('40vh'),
  },
}));

export const FileContainer = ({ sessionId, clientKey }: FileContainerProps) => {
  const pbUrl = import.meta.env.VITE_PB_URL as string;
  const pb = new PocketBase(pbUrl);
  const { classes, theme, cx } = useStyles();
  const [files, setFiles] = useState<Array<FileItem>>([]);
  const [selection, setSelection] = useState([] as Array<string>);
  const [scrolled, setScrolled] = useState(false);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((file) => file !== id) : [...current, id]
    );
  const toggleAll = () => {
    setSelection((current) =>
      current.length === files.length ? [] : files.map((file) => file.id)
    );
  };

  const updateFileList = async () => setFiles(await getFileList(pb, sessionId));

  useEffect(() => {
    updateFileList().catch(() =>
      showErrorNotification(
        'update-file-list-failed',
        'Failed to update file list',
        'Failed to fetch and update file list',
        5000
      )
    );

    pb.collection('sessions')
      .subscribe(sessionId, () => {
        updateFileList().catch(() =>
          showErrorNotification(
            'update-file-list-failed',
            'Failed to update file list',
            'Failed to fetch and update file list',
            5000
          )
        );
      })
      .catch(() =>
        showErrorNotification(
          'database-subscription-failed',
          'File autoupdate subscription failed',
          'Failed to subscribe to database. Manual refresh needed to view new files.',
          10000
        )
      );

    return () => {
      pb.collection('sessions')
        .unsubscribe(sessionId)
        .catch(() => {
          /*Backend will automatically unsubscribe if connection is idle for 5 minutes*/
        });
    };
  }, []);

  const rows = files.map((file) => {
    const selected = selection.includes(file.id);
    return (
      <tr key={file.id} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(file.id)}
            onChange={() => toggleRow(file.id)}
            transitionDuration={0}
          />
        </td>
        <td className="flex items-center">
          {file.iv ? (
            <IconLockCheck
              color={theme.colors[theme.primaryColor][6]}
              className="pr-3"
              size={rem(35)}
            />
          ) : (
            <IconLockOff color="red" className="pr-3" size={rem(35)} />
          )}

          {file.name}
        </td>
        <td>{fileSizeToReadableString(file.size)}</td>
        <td>
          <Button
            variant="subtle"
            color="red"
            w="fit-content"
            p={rem(3)}
            onClick={() => {
              deleteFile(pb, sessionId, file.id).catch(() =>
                showErrorNotification(
                  'delete-failed',
                  'Failed to delete file',
                  'Manual deletion failed. Files are automatically deleted on the server upon expiry.',
                  5000
                )
              );
            }}
          >
            <IconTrashX color="red" stroke={1.5} />
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <div className="flex flex-col gap-5 items-center">
      <ScrollArea
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        className={classes.scrollAreaWrapper}
      >
        <Table w={rem('80vw')} maw={rem(800)} miw={rem(300)} verticalSpacing="sm">
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th style={{ width: rem(40), zIndex: 10 }}>
                <Checkbox
                  onChange={toggleAll}
                  checked={selection.length !== 0 && selection.length === files.length}
                  indeterminate={selection.length > 0 && selection.length !== files.length}
                  transitionDuration={0}
                />
              </th>
              <th>Name</th>
              <th style={{ width: rem(100) }}>Size</th>
              <th style={{ width: rem(50) }} />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>

      <Button
        radius="xl"
        onClick={() => {
          downloadFiles(selection, files, clientKey).catch(() => {
            /*error handling for failed downloads exist within async function*/
          });
        }}
        size="md"
        mb={rem(20)}
        disabled={!selection.length}
        className={classes.downloadButton}
      >
        Download Selected
      </Button>
    </div>
  );
};
