'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FileText, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dropzone,
    DropzoneContent,
    DropzoneEmptyState
} from '@/components/ui/dropzone';

interface FileUploaderProps {
    id: string;
    onDrop?: (files: File[]) => void;
    existingFileUrl?: string;
    disabled?: boolean;
}

const FileUploader = ({ id, onDrop, existingFileUrl, disabled = false }: FileUploaderProps) => {
    const [files, setFiles] = useState<File[] | undefined>();
    const [hasExistingFile, setHasExistingFile] = useState(false);

    useEffect(() => {
        setHasExistingFile(!!existingFileUrl);
    }, [existingFileUrl]);

    const handleDrop = (droppedFiles: File[]) => {
        console.log(droppedFiles, id);
        setFiles(droppedFiles);
        setHasExistingFile(false); // Hide existing file when new file is dropped

        // Call parent onDrop handler if provided
        if (onDrop) {
            onDrop(droppedFiles);
        } else {
            // Fallback toast if no onDrop handler
            if (droppedFiles.length > 0) {
                toast.success(`Successfully uploaded ${droppedFiles.length} file(s)`);
            }
        }
    };

    const handleError = (error: Error) => {
        toast.error(error.message || 'File upload failed');
        console.error('File upload error:', error);
    };

    const removeFiles = () => {
        setFiles(undefined);
        setHasExistingFile(false);
    };

    const getFileNameFromUrl = (url: string) => {
        return url.split('/').pop() || 'Document';
    };

    const openExistingFile = () => {
        if (existingFileUrl) {
            window.open(existingFileUrl, '_blank');
        }
    };

    const hasFile = (files && files.length > 0) || hasExistingFile;

    return (
        <div className="w-full">
            <Dropzone
                maxSize={1024 * 1024 * 10} // 10MB limit
                minSize={1024} // 1KB minimum
                onDrop={handleDrop}
                onError={handleError}
                src={files}
                disabled={disabled}
                className={
                    `h-[190px] w-full border-dashed bg-muted hover:bg-muted/50 transition ease-in-out duration-200 cursor-pointer relative overflow-hidden ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
                }
            >
                {hasFile ? (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                        {/* File Icon and Info */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3 py-1">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>

                        {/* File Name */}
                        <div className="text-center mb-3">
                            <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                {files && files.length > 0
                                    ? files[0].name
                                    : getFileNameFromUrl(existingFileUrl!)
                                }
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {files && files.length > 0 ? 'New file selected' : 'Current file'}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 z-10">
                            {hasExistingFile && !files && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={openExistingFile}
                                    className="h-7 px-2 text-xs cursor-pointer"
                                >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={removeFiles}
                                className="h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                                disabled={disabled}
                            >
                                <X className="h-3 w-3 mr-1" />
                                Remove
                            </Button>
                        </div>

                        {/* Overlay instruction */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-200 flex items-end justify-center pb-3">
                            <p className="text-xs text-muted-foreground/80">
                                Drop new file to replace
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <DropzoneEmptyState />
                        <DropzoneContent />
                    </>
                )}
            </Dropzone>
        </div>
    );
};

export { FileUploader };
