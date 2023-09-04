import { createStyles, Container, ActionIcon, rem } from '@mantine/core';
import { BrandGithub } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    [theme.fn.smallerThan('xs')]: {
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

export default function FooterSocial() {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <h3>About this project</h3>
        <ActionIcon size="lg">
          <BrandGithub size="3rem" strokeWidth={1.5} />
        </ActionIcon>
      </Container>
    </div>
  );
}
