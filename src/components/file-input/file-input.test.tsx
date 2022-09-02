import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileInput, ImportedFile } from './file-input';
import { noop } from '../../helpers/func';

describe('FileInput', () => {
  let testLabel: string;
  let testImportedFile: ImportedFile;
  let mockOnImportedFileChange: jest.Mock<void, [ImportedFile | undefined]>;

  beforeEach(() => {
    testLabel = 'TEST_LABEL';
    testImportedFile = {
      name: 'TEST_FILE_NAME',
      content: 'TEST_FILE_CONTENT',
    };
    mockOnImportedFileChange = jest.fn();
  });

  it('should render with default elements', () => {
    render(<FileInput onImportedFileChange={noop} label={testLabel} />);
    expect(screen.queryByText(testLabel)).toBeInTheDocument();
    expect(screen.queryByText(testImportedFile.name)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'remove-file' })).not.toBeInTheDocument();
  });

  it('should show the file name when a file is provided', () => {
    render(
      <FileInput onImportedFileChange={noop} label={testLabel} importedFile={testImportedFile} />
    );
    expect(screen.queryByText(testLabel)).toBeInTheDocument();
    expect(screen.queryByText(testImportedFile.name)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'remove-file' })).toBeInTheDocument();
  });

  it('should remove the file when the remove file button is clicked', async () => {
    render(
      <FileInput
        onImportedFileChange={mockOnImportedFileChange}
        label={testLabel}
        importedFile={testImportedFile}
      />
    );
    userEvent.click(screen.getByRole('button', { name: 'remove-file' }));
    expect(mockOnImportedFileChange).toHaveBeenCalledWith(undefined);
  });
});
