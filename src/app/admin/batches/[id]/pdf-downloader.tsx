"use client";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import type { Media } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { IconPdf } from "@tabler/icons-react";
import { Share } from "lucide-react";
import { toast } from "sonner";

interface Props {
  media: Media[] | undefined;
  batchReference: string;
}

const PDFDownloader = ({ media, batchReference }: Props) => {
  const [isLoading, setIsLoading] = useState(false);  
  const [isShareSupported, setIsShareSupported] = useState(false);

  useEffect(() => {
    // The Web Share API is not available on all browsers.
    // We check for its existence before showing the Share button.
    // `navigator.canShare` is a more robust check for file sharing.
    if (typeof navigator.canShare === "function") {
      const dummyFile = new File([""], "dummy.pdf", {
        type: "application/pdf",
      });
      if (navigator.canShare({ files: [dummyFile] })) {
        setIsShareSupported(true);
      }
    }
  }, []);

  /**
   * Fetches an image from a URL and returns it as a Base64 string.
   * @param {string} url - The URL of the image.
   * @returns {Promise<string>} A promise that resolves with the Base64 image data.
   */
  const fetchImageAsBase64 = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generatePdfDoc = async () => {
    const doc = new jsPDF();
    let isFirstPage = true;

    for (const { url } of media!) {
      if (!isFirstPage) {
        doc.addPage();
      }

      const imageData = await fetchImageAsBase64(url);
      const img = new Image();
      img.src = imageData as string;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Calculate aspect ratio to fit the image on the page with a margin
      const ratio = Math.min(
        (pageWidth * 0.9) / img.width,
        (pageHeight * 0.9) / img.height
      );
      const imgWidth = img.width * ratio;
      const imgHeight = img.height * ratio;

      // Center the image
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      doc.addImage(img, "JPEG", x, y, imgWidth, imgHeight);
      isFirstPage = false;
    }
    return doc;
  };

  /**
   * Creates a PDF from a list of image URLs and triggers a download.
   */
  const createAndDownloadPdf = async () => {
    setIsLoading(true);    

    try {
      const doc = await generatePdfDoc();

      // Save the PDF
      doc.save(batchReference + ".pdf");
    } catch (err) {
      console.error("Error creating PDF:", err);
      toast.error("Failed to create PDF. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {    
    try {
      const doc = await generatePdfDoc();
      const pdfBlob = doc.output("blob");
      const pdfFile = new File([pdfBlob], batchReference, {
        type: "application/pdf",
      });

      await navigator.share({
        title: batchReference,
        text: `Check out this PDF: ${batchReference}`,
        files: [pdfFile],
      });
    } catch (err: unknown) {
      console.error("Error sharing PDF:", err);      
      toast.error("Failed to share PDF. Check console for details.");
    }
  };

  return (
    <>   
      <Button
        onClick={createAndDownloadPdf}
        disabled={isLoading}
        className="w-fit"
      >
        <IconPdf />
        <span className="text-sm">Save PDF</span>
      </Button>
      <Button onClick={handleShare} disabled={!isShareSupported || isLoading} className="w-fit">
        <Share className="mr-2" />
        <span className="text-sm">Share</span>
      </Button>
    </>
  );
};

export default PDFDownloader;
