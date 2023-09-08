import FileResponse from './FileResponse';

type SessionFilesDto = {
  expand: {
    'files(session)': Array<FileResponse>;
  };
};

export default SessionFilesDto;
