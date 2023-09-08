import bs58check from 'bs58check';

const generateClientKey = async (): Promise<string> => {
  const clientKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 128 }, true, [
    'encrypt',
    'decrypt',
  ]);
  const clientKeyAsArrayBuffer = await crypto.subtle.exportKey('raw', clientKey);
  return bs58check.encode(new Uint8Array(clientKeyAsArrayBuffer));
};

export default generateClientKey;
