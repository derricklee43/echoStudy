export function readFile(file: File) {
  return readTxtFile(file);
}

function readTxtFile(txtFile: File) {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      const content = fileReader.result as string;
      resolve(content);
    });

    fileReader.addEventListener('error', () => {
      reject('unable to read text file');
    });

    fileReader.readAsText(txtFile);
  });
}
