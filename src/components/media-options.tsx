"use client";
import PDFDownloader from "@/app/admin/batches/[id]/pdf-downloader";
import { Media } from "@prisma/client";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  media: Media[] | undefined;
  batchReference: string;
}

const MediaOptions = ({ media, batchReference }: Props) => {
  
  const downloadImage = () => {
    media?.forEach((media) => {
      const link = document.createElement("a");
      link.href = media.url;
      link.download = media.title || media.id;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="flex justify-start items-center gap-4">
      <Button onClick={downloadImage} className="w-fit">
        <Download className="mr-2" />
        <span className="text-sm">Download Images</span>
      </Button>
      <PDFDownloader media={media} batchReference={batchReference} />
      
    </div>
  );
};

export default MediaOptions;
