import { createStyles, Container, rem, Button, Text } from '@mantine/core';
import { BrandGithub } from 'tabler-icons-react';

const githubLink = 'https://github.com/ansonhltsang/file-portal';

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export default function Footer() {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Button
          variant="white"
          color="gray"
          w="fit-content"
          onClick={() => window.open(githubLink, '_blank')}
        >
          <Text fz="lg" fw="500" align="center">
            About Project
          </Text>
        </Button>
        <Button
          variant="subtle"
          color="gray"
          w="fit-content"
          p={rem(3)}
          onClick={() => window.open(githubLink, '_blank')}
        >
          <BrandGithub size={rem(30)} strokeWidth={1.5} color="grey" />
        </Button>
      </Container>
    </div>
  );
}
