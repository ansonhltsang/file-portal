import PocketBase from 'pocketbase';

const deleteFile = async (pb: PocketBase, sessionId: string, fileId: string) => {
  await pb.collection('files').delete(fileId, { sessionId });
};

export default deleteFile;
