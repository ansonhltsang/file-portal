import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button, Flex } from '@mantine/core';
import Countdown from 'react-countdown';
import { FileContainer } from './FileContainer';
import { DropzoneContainer } from './DropzoneContainer';
import decodeClientKey from './utils/decodeClientKey';
import { LinkContainer } from './LinkContainer';
import showErrorNotification from '../Home/utils/showErrorNotification';
import { ExpiryTimer } from './ExpiryTimer';

type SessionParams = {
  id: string;
};

type SessionValidationResponse = {
  expired: string;
};

export const Session = () => {
  const pbUrl = import.meta.env.VITE_PB_URL as string;
  const { id } = useParams<keyof SessionParams>() as SessionParams;
  const base58CheckEncodedClientKey = useLocation().hash.slice(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(true);
  const [clientKey, setClientKey] = useState<CryptoKey | null>(null);
  const [sessionExpireTime, setSessionExpireTime] = useState<number | null>(null);

  useEffect(() => {
    const validateSessionId = async () => {
      const url = `${pbUrl}/api/collections/sessions/records/${id}`;
      const response = await fetch(url);
      if (!response.ok) {
        setIsSessionValid(false);
      } else {
        const { expired } = (await response.json()) as SessionValidationResponse;
        const expiryTime = new Date();
        expiryTime.setTime(Date.parse(expired));
        setSessionExpireTime(Date.parse(expired));
      }
      setIsLoading(false);
    };

    const importClientKey = async () => {
      setClientKey(await decodeClientKey(base58CheckEncodedClientKey));
    };

    validateSessionId().catch(() =>
      showErrorNotification(
        'invalid-session-id',
        'Invalid session ID',
        'Session ID is not valid, please create a new session',
        false
      )
    );
    importClientKey().catch(() =>
      showErrorNotification(
        'invalid-client-key',
        'Invalid client key',
        'Files uploaded without a valid client key will not be encrypted',
        false
      )
    );
  }, []);

  return (
    <Flex direction="column" rowGap="20px" align="center" justify="center" className="flex-1">
      {isLoading ? (
        <h1>Loading session...</h1>
      ) : isSessionValid ? (
        <>
          <LinkContainer />
          {sessionExpireTime !== null && (
            <Countdown date={sessionExpireTime} renderer={ExpiryTimer} />
          )}
          <DropzoneContainer sessionId={id} clientKey={clientKey} />
          <FileContainer sessionId={id} clientKey={clientKey} />
        </>
      ) : (
        <>
          <h1>Session not found</h1>
          <Button component="a" href="/" radius="xl" size="md">
            Back to Home
          </Button>
        </>
      )}
    </Flex>
  );
};
