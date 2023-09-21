const fileSizeToReadableString = (fileSize: number) => {
  const sizes = [' Bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];

  for (let i = 1; i < sizes.length; i += 1) {
    if (fileSize < 1024 ** i)
      return `${Math.round((fileSize / 1024 ** (i - 1)) * 100) / 100} ${sizes[i - 1]}`;
  }
  return fileSize.toString();
};

export default fileSizeToReadableString;
