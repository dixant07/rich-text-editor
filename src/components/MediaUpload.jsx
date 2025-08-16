import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Upload, X } from 'lucide-react';

export default function MediaUpload({ onMediaSelect, maxFiles = 4 }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      // Check file type (images only for now)
      return file.type.startsWith('image/');
    }).slice(0, maxFiles - selectedFiles.length);

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(newFiles);

      // Create previews
      const newPreviews = [...previews];
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push({
            file,
            url: e.target.result,
            name: file.name,
            size: file.size
          });
          setPreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      });

      // Notify parent component
      if (onMediaSelect) {
        onMediaSelect(newFiles);
      }
    }

    // Reset input
    event.target.value = '';
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    
    if (onMediaSelect) {
      onMediaSelect(newFiles);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      {/* Upload Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="h-8 w-8 p-0"
        disabled={selectedFiles.length >= maxFiles}
      >
        <Image className="h-4 w-4" />
      </Button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {previews.length} file{previews.length > 1 ? 's' : ''} selected
          </div>
          <div className="grid grid-cols-2 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="relative border rounded-lg overflow-hidden bg-muted/20">
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="w-full h-20 object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate">
                  {preview.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(preview.size)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area (when no files selected) */}
      {selectedFiles.length === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            Click to upload images
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            PNG, JPG, GIF up to 10MB each
          </div>
        </div>
      )}

      {/* Add More Button */}
      {selectedFiles.length > 0 && selectedFiles.length < maxFiles && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Add More Images ({selectedFiles.length}/{maxFiles})
        </Button>
      )}
    </div>
  );
}

