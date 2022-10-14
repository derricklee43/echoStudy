import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CancelIcon } from '@/assets/icons/cancel-icon/cancel-icon';
import { DocIcon } from '@/assets/icons/doc-icon/doc-icon';
import { LoadingIcon } from '@/assets/icons/loading-icon/loading-icon';
import { Button } from '@/components/button/button';
import { noop } from '@/helpers/func';
import { readFile } from './file-reader';
import './file-input.scss';

export interface ImportedFile {
  name: string;
  content: string;
}

interface FileInputProps {
  className?: string;
  label: string;
  importedFile?: ImportedFile;
  onImportedFileChange: (importedFile?: ImportedFile) => void;
}

export const FileInput = ({
  className = '',
  label,
  importedFile,
  onImportedFileChange,
}: FileInputProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const id = uuidv4();

  return (
    <div className={`c-file-input ${className}`}>
      <Button variant="light" onClick={noop} className="c-file-input-button">
        <label htmlFor={id}>{label}</label>
      </Button>
      <div className="c-selected-file">
        {getSelectedFileIcon()}
        {getSelectedFile()}
      </div>
      <input key={id} type="file" accept=".txt" id={id} name="myfile" onChange={importFile} />
    </div>
  );

  function getSelectedFileIcon() {
    return isLoading ? <LoadingIcon /> : <DocIcon variant="dark" />;
  }

  function getSelectedFile() {
    const removeFileIcon = (
      <Button
        variant="invisible"
        onClick={() => onImportedFileChange(undefined)}
        className="remove-file-button"
        ariaLabel="remove-file"
      >
        <CancelIcon variant="dark" className="remove-file-icon" />
      </Button>
    );
    return (
      <>
        <label className="imported-file-name">{importedFile?.name ?? 'no file chosen'}</label>
        {importedFile !== undefined && removeFileIcon}
      </>
    );
  }

  async function importFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files == null) {
      return;
    }
    setIsLoading(true);
    const file = e.target.files[0];
    const fileContents = await readFile(file);
    const newImportedFile = { name: file.name, content: fileContents };
    onImportedFileChange(newImportedFile);
    setIsLoading(false);
  }
};
