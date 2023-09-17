import { CopyButton, Button, Flex, rem, Tooltip, Text, Popover, createStyles } from '@mantine/core';
import { useClipboard, useDisclosure } from '@mantine/hooks';
import { IconCopy, IconCheck, IconQrcode } from '@tabler/icons-react';
import { QRCodeSVG } from 'qrcode.react';

type componentClassName = {
  className: string;
};

const useStyles = createStyles((theme) => ({
  outerFlexContainer: {
    flexDirection: 'row',
    [theme.fn.smallerThan('md')]: {
      marginTop: rem(30),
      flexDirection: 'column',
      rowGap: rem(5),
    },
  },

  largeScreen: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },
  smallScreen: {
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },
}));

const CopyLinkButton = ({ className }: componentClassName) => {
  const clipboard = useClipboard();
  return (
    <Tooltip
      label="Link copied!"
      offset={5}
      position="bottom"
      radius="xl"
      transitionProps={{ duration: 100, transition: 'slide-down' }}
      opened={clipboard.copied}
      className={className}
    >
      <Button
        variant="light"
        rightIcon={
          clipboard.copied ? (
            <IconCheck size="1.2rem" stroke={1.5} />
          ) : (
            <IconCopy size="1.2rem" stroke={1.5} />
          )
        }
        radius="xl"
        size="md"
        styles={{
          root: { paddingRight: rem(14), height: rem(48) },
          rightIcon: { marginLeft: rem(22) },
        }}
        onClick={() => clipboard.copy(window.location.href)}
        fw="300"
        mr={rem(20)}
        ml={rem(30)}
      >
        {window.location.href}
      </Button>
    </Tooltip>
  );
};

const SmallCopyLinkButton = ({ className }: componentClassName) => (
  <CopyButton value={window.location.href}>
    {({ copied, copy }) => (
      <Button color={copied ? 'teal' : 'green'} onClick={copy} mr={rem(20)} className={className}>
        {copied ? 'Copied Link' : 'Copy Link'}
      </Button>
    )}
  </CopyButton>
);

const QrPopover = () => {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover position="right" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <Button
          onMouseEnter={open}
          onMouseLeave={close}
          w="fit-content"
          px={0}
          className="aspect-square"
        >
          <IconQrcode height="100%" width="100%" />
        </Button>
      </Popover.Target>
      <Popover.Dropdown sx={{ pointerEvents: 'none' }} p={rem(10)} className="flex align-middle">
        <QRCodeSVG value={window.location.href} />
      </Popover.Dropdown>
    </Popover>
  );
};

export const LinkContainer = () => {
  const { classes } = useStyles();

  return (
    <Flex className={classes.outerFlexContainer} align="center">
      <Text fw={500} fz={rem(30)}>
        Share Session
      </Text>
      <Flex direction="row" align="center">
        <SmallCopyLinkButton className={classes.smallScreen} />
        <CopyLinkButton className={classes.largeScreen} />
        <QrPopover />
      </Flex>
    </Flex>
  );
};
