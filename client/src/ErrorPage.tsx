import { Button } from '@mantine/core';

export default function ErrorPage() {
  return (
    <div id="error-page" className="flex-1 flex flex-col justify-center items-center">
      <h1 className="m-0">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Button component="a" href="/" radius="xl" size="md">
        Back to Home
      </Button>
    </div>
  );
}
