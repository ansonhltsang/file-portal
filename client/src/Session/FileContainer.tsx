import { useEffect } from 'react';
import PocketBase from 'pocketbase';

// interface IFileItem {
//   id: string;
//   name: string;
//   size: number; // In bytes
// }

export type FileContainerProps = {
  sessionId: string;
};

export const FileContainer = ({ sessionId }: FileContainerProps) => {
  const pb = new PocketBase(import.meta.env.VITE_PB_URL as string);
  // const [files, setFiles] = useState<Array<IFileItem>>([]);

  useEffect(() => {
    pb.collection('sessions')
      .subscribe(sessionId, (e) => {
        console.log(e.action);
        console.log(e.record);
      })
      .catch(() => {});

    return () => {
      pb.collection('sessions')
        .unsubscribe(sessionId)
        .catch(() => {});
    };
  });

  useEffect(() => {
    pb.collection('files')
      .subscribe('*', (e) => {
        console.log(e.action);
        console.log(e.record);
      })
      .catch(() => {});

    return () => {
      pb.collection('files')
        .unsubscribe('*')
        .catch(() => {});
    };
  });

  return (
    <>
      <h1>container</h1>
    </>
  );
};
