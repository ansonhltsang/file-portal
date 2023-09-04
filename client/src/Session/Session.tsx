import { Flex } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import PocketBase from 'pocketbase';
import { FileContainer } from './FileContainer';

type SessionParams = {
  id: string;
};

export const Session = () => {
  const { id } = useParams<keyof SessionParams>() as SessionParams;
  const pb = new PocketBase(import.meta.env.VITE_PB_URL as string);
  // const [files, setFiles] = useState<Array<IFileItem>>([]);

  //TODO: Check session id exists on pb

  useEffect(() => {
    console.log('subscribed');
    pb.collection('sessions')
      .subscribe(id, (e) => {
        console.log(e.action);
        console.log(e.record);
      })
      .catch(() => {});

    return () => {
      console.log('unsubscribed');
      pb.collection('sessions')
        .unsubscribe(id)
        .catch(() => {});
    };
  });

  return (
    <Flex className="flex-1">
      <FileContainer sessionId={id} />
      <h1>Nice</h1>
    </Flex>
  );
};
