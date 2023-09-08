import PocketBase from 'pocketbase';
import SessionFilesDto from '../types/SessionFilesDto';
import FileItem from '../types/FileItem';

const getFileList = async (pb: PocketBase, sessionId: string): Promise<Array<FileItem>> => {
  const response: SessionFilesDto = await pb.collection('sessions').getOne(sessionId, {
    expand: 'files(session)',
    fields: 'expand.files(session)',
  });

  if (response.expand['files(session)'] === undefined) {
    return [];
  }

  return response.expand['files(session)'].map((file) => ({
    id: file.id,
    name: file.baseName,
    serverName: file.file,
    size: file.size,
    iv: file.iv,
  }));
};

export default getFileList;
