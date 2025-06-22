
import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, Check, X } from 'lucide-react';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onCrop: (croppedImage: string) => void;
  imageSrc: string;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ isOpen, onClose, onCrop, imageSrc }) => {
  const [zoom, setZoom] = useState([1]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setCrop({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [dragging, dragStart]);

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const size = 200;
      canvas.width = size;
      canvas.height = size;

      const scale = zoom[0];
      const centerX = size / 2;
      const centerY = size / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI);
      ctx.clip();

      const imgSize = Math.min(img.width, img.height) * scale;
      const sx = (img.width - imgSize) / 2 + crop.x;
      const sy = (img.height - imgSize) / 2 + crop.y;

      ctx.drawImage(
        img,
        sx, sy, imgSize, imgSize,
        0, 0, size, size
      );

      ctx.restore();

      const croppedImage = canvas.toDataURL('image/png');
      onCrop(croppedImage);
      onClose();
    };
    img.src = imageSrc;
  };

  const resetCrop = () => {
    setZoom([1]);
    setCrop({ x: 0, y: 0 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Profile Photo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div 
            ref={containerRef}
            className="relative w-64 h-64 mx-auto border-2 border-dashed border-muted-foreground rounded-full overflow-hidden bg-muted"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={imageSrc}
              alt="Crop preview"
              className="absolute inset-0 w-full h-full object-cover cursor-move"
              style={{
                transform: `scale(${zoom[0]}) translate(${crop.x}px, ${crop.y}px)`,
                transformOrigin: 'center'
              }}
              draggable={false}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Zoom</label>
            <Slider
              value={zoom}
              onValueChange={setZoom}
              min={0.5}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetCrop}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleCrop}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-1" />
              Crop
            </Button>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
