import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Controller } from "react-hook-form";

interface FileUploadValidationDemoProps {
  title: string;
  control: any; // react-hook-form control
  name: string; // field name in the form
}

export function FileUploadValidationDemo({ title, control, name }: FileUploadValidationDemoProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const [files, setFiles] = React.useState<File[]>(field.value ? [field.value] : []);

        const onFileValidate = React.useCallback(
          (file: File): string | null => {
            if (files.length >= 1) return "You can only upload up to 1 file";
            if (!file.type.startsWith("image/")) return "Only image files are allowed";
            const MAX_SIZE = 2 * 1024 * 1024; // 2MB
            if (file.size > MAX_SIZE) return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
            return null;
          },
          [files]
        );

        const onFileReject = React.useCallback((file: File, message: string) => {
          toast(message, {
            description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
          });
        }, []);

        React.useEffect(() => {
          field.onChange(files[0] || null); // only one file
        }, [files]);

        return (
          <div>
            <FileUpload
              value={files}
              onValueChange={setFiles}
              onFileValidate={onFileValidate}
              onFileReject={onFileReject}
              accept="image/*"
              className="w-full"
            >
              {!files?.length && (
                <FileUploadDropzone>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                      <Upload className="size-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">{title}</p>
                    <FileUploadTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-1  text-[12px] w-fit">
                        Browse files
                      </Button>
                    </FileUploadTrigger>
                  </div>
                </FileUploadDropzone>
              )}

              <FileUploadList>
                {files.map((file) => (
                  <FileUploadItem key={file.name} value={file}>
                    <FileUploadItemPreview  />
                    <FileUploadItemMetadata />
                    <FileUploadItemDelete asChild>
                      <Button variant="ghost" size="icon" className="size-7">
                        <X />
                      </Button>
                    </FileUploadItemDelete>
                  </FileUploadItem>
                ))}
              </FileUploadList>
            </FileUpload>

            {/* Display RHF validation error */}
            {fieldState.error && (
              <p className="text-red-600 text-sm mt-1">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
