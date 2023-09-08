import { useState } from 'react';
import { Flex } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import PocketBase from 'pocketbase';
import generateClientKey from './utils/generateClientKey';

// const useStyles = createStyles((theme) => ({

//   HalfContainer: {
//     margin: 0,
//     }
//   }

// inner: {
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   paddingTop: theme.spacing.xl,
//   paddingBottom: theme.spacing.xl,

//   [theme.fn.smallerThan('xs')]: {
//     flexDirection: 'column',
//   },
// },

// links: {
//   [theme.fn.smallerThan('xs')]: {
//     marginTop: theme.spacing.md,
//   },
// },
// }));

export const Home = () => {
  const [isSessionLoading, setIsSessionLoading] = useState(false);

  const navigate = useNavigate();

  const pb = new PocketBase(import.meta.env.VITE_PB_URL as string);

  const createSessionAndRedirect = async () => {
    setIsSessionLoading(true);
    const session = await pb.collection('sessions').create({
      expired: '',
    });
    const clientKey = await generateClientKey();
    const path = `/${session.id}#${clientKey}`;
    navigate(path);
    setIsSessionLoading(false);
  };

  return (
    <Flex direction={{ base: 'column', xs: 'row' }} justify={{ base: 'center' }} className="flex-1">
      <div className="flex-1 bg-red-200 p-5 flex justify-center items-center">
        <button
          type="button"
          onClick={() => {
            createSessionAndRedirect().catch(() => setIsSessionLoading(false));
          }}
          className="h-1/4"
        >
          {isSessionLoading ? <h1>Loading...</h1> : <h1>Create Session</h1>}
        </button>
      </div>
      <div className="flex-1 bg-blue-200 p-5 align-">
        <h1>Share files seamlessly across devices</h1>
        <h2>Create a session to get started</h2>
        <hr className="border-solid border border-slate-400" />
        <h2>Alternatively</h2>
        <h2>Scan QR code of an existing session</h2>
      </div>
    </Flex>
  );
};
