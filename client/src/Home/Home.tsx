import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PocketBase from 'pocketbase';
import image from '../favicon.svg';
import generateClientKey from './utils/generateClientKey';

const GITHUB_LINK = 'https://github.com/ansonhltsang/file-portal';
const DEFAULT_SESSION_DURATION_IN_MINUTES = import.meta.env
  .VITE_DEFAULT_SESSION_DURATION_IN_MINUTES;

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  },

  content: {
    maxWidth: rem(480),
    marginRight: `calc(${theme.spacing.xl} * 3)`,
    marginLeft: `calc(${theme.spacing.xl} * 3)`,
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
    },
    [theme.fn.smallerThan('xs')]: {
      marginRight: 0,
      marginLeft: 0,
    },
  },

  title: {
    color: theme.black,
    fontFamily: theme.fontFamily,
    fontSize: rem(44),
    lineHeight: 1.2,
    fontWeight: 700,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  highlight: {
    position: 'relative',
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)}`,
  },
}));

export function Home() {
  const [isSessionLoading, setIsSessionLoading] = useState(false);

  const navigate = useNavigate();

  const pb = new PocketBase(import.meta.env.VITE_PB_URL as string);

  const { classes } = useStyles();

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
    <div>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              An <span className={classes.highlight}>E2E encrypted</span> file transfer service
            </Title>
            <Text color="dimmed" mt="md">
              Transfer files between devices seamlessly with no compromise on privacy - create a
              session to get started!
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconCheck size={rem(12)} stroke={5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>End-to-end encryption</b> – all uploaded files are AES encrypted, the server can
                never read the original content
              </List.Item>
              <List.Item>
                <b>Live updates</b> – files uploaded from another device automatically shows up here
                without refreshing the page
              </List.Item>
              <List.Item>
                <b>Auto-wipe</b> – each session expires in {DEFAULT_SESSION_DURATION_IN_MINUTES}{' '}
                minutes, and all files uploaded in that session are permanently removed from the
                server
              </List.Item>
            </List>

            <Group mt={30}>
              <Button
                radius="xl"
                size="md"
                className={classes.control}
                onClick={() => {
                  createSessionAndRedirect().catch(() => setIsSessionLoading(false));
                }}
                disabled={isSessionLoading}
              >
                Create Session
              </Button>
              <Button
                variant="default"
                radius="xl"
                size="md"
                className={classes.control}
                onClick={() => window.open(GITHUB_LINK, '_blank')}
              >
                GitHub
              </Button>
            </Group>
          </div>
          <Image src={image} className={classes.image} />
        </div>
      </Container>
    </div>
  );
}
