import bs58check from 'bs58check';

const decodeClientKey = async (base58CheckEncodedClientKey: string) => {
  const clientKeyAsArray = bs58check.decode(base58CheckEncodedClientKey);
  return crypto.subtle.importKey('raw', clientKeyAsArray, { name: 'AES-GCM', length: 128 }, false, [
    'encrypt',
    'decrypt',
  ]);
};

export default decodeClientKey;
