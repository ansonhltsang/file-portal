import { Text, Flex, rem, Popover } from '@mantine/core';
import { IconAlarm } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

type ExpiryTimerProps = {
  minutes: number;
  seconds: number;
  completed: boolean;
};

type TimerPopoverProps = {
  completed: boolean;
};

const TimerPopover = ({ completed }: TimerPopoverProps) => {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover position="bottom" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <span onMouseEnter={open} onMouseLeave={close} className="aspect-square">
          <IconAlarm color={completed ? 'red' : 'black'} />
        </span>
      </Popover.Target>
      <Popover.Dropdown
        sx={{ pointerEvents: 'none' }}
        p={rem(10)}
        className="flex align-middle mx-3"
        maw="90%"
      >
        <Text>
          Upon session expiry, this session and all related files will be permanently deleted from
          the server.
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export const ExpiryTimer = ({ minutes, seconds, completed }: ExpiryTimerProps) => (
  <Flex direction="row" align="flex-start" justify="center">
    <TimerPopover completed={completed} />
    <Text pl={rem(4)}>
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </Text>
  </Flex>
);
