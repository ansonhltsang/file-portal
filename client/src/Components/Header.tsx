import { createStyles, Header, Container, rem, Text, Button } from '@mantine/core';
import { BrandGithub } from 'tabler-icons-react';

const HEADER_HEIGHT = rem(90);

const githubLink = 'https://github.com/ansonhltsang/file-portal';

const useStyles = createStyles(() => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    maxWidth: rem('80vw'),
  },
}));

export default function HeaderContainer() {
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
    </Header>
  );
}
