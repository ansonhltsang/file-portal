import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div id="error-page" className="flex-1 flex flex-col justify-center items-center">
      <h1 className="m-0">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Button radius="xl" size="md" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </div>
  );
}
