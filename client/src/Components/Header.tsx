import {
  createStyles,
  Header,
  Container,
  Burger,
  Paper,
  Transition,
  rem,
  ActionIcon,
  Text,
  Button,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BrandGithub } from 'tabler-icons-react';

const HEADER_HEIGHT = rem(90);

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    maxWidth: rem('80vw'),
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },
}));

export default function HeaderResponsive() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes } = useStyles();

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Button
          variant="white"
          color="dark"
          w="fit-content"
          onClick={() => window.location.assign('/')}
        >
          <Text fz={rem(40)} fw="700" align="center">
            File Portal
          </Text>
        </Button>

        <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              <a
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  close();
                }}
                className={classes.link}
              >
                About this project
              </a>
              <ActionIcon size="lg">
                <BrandGithub size="3rem" strokeWidth={1.5} />
              </ActionIcon>
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
