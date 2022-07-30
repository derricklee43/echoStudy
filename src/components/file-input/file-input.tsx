import './file-input.scss';
import React, { useState } from 'react';
import { noop } from '../../helpers/func';
import { Button } from '../button/button';
import { v4 as uuidv4 } from 'uuid';
import { readFile } from './file-reader';
import { LoadingIcon } from '../../assets/icons/loading-icon/loading-icon';
import { CancelIcon } from '../../assets/icons/cancel-icon/cancel-icon';
import { DocIcon } from '../../assets/icons/doc-icon/doc-icon';

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
      {importedFile ? getSelectedFile() : getSelectFileButton()}
      <input key={id} type="file" id={id} name="myfile" onChange={importFile} />
    </div>
  );

  function getSelectFileButton() {
    return (
      <Button variant="light" onClick={noop} className="c-file-input-button">
        <label htmlFor={id}>{label}</label>
      </Button>
    );
  }

  function getSelectedFile() {
    if (importedFile === undefined) {
      return undefined;
    }
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
    const rightIcon = isLoading ? <LoadingIcon /> : removeFileIcon;
    return (
      <div className="c-selected-file">
        <DocIcon variant="dark" />
        <label className="imported-file-name">{importedFile.name}</label>
        {rightIcon}
      </div>
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
