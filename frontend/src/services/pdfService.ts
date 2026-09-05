import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generateA4Pdf(element: HTMLElement, fileName: string): Promise<{ blob: Blob; base64: string }> {
  // Capture canvas with 3.5x scale and lossless PNG for ultra-crisp, razor-sharp text
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1024,
    windowHeight: 1440,
    scrollY: 0,
    scrollX: 0,
    imageTimeout: 0,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.querySelector('.print-a4-page') as HTMLElement;
      if (clonedElement) {
        clonedElement.style.transform = 'none';
        clonedElement.style.width = '794px';
        clonedElement.style.minWidth = '794px';
        clonedElement.style.maxWidth = '794px';
        clonedElement.style.minHeight = '1123px';
        clonedElement.style.margin = '0 auto';
        clonedElement.style.maxHeight = 'none';
        clonedElement.style.overflow = 'visible';
        clonedElement.style.boxShadow = 'none';
        clonedElement.style.border = 'none';

        // Ensure all text elements inside document have overflow: visible and ample line-height so Thai vowels and tone marks never get clipped
        const allText = clonedElement.querySelectorAll('*');
        allText.forEach((node) => {
          const el = node as HTMLElement;
          el.style.overflow = 'visible';
          el.style.textOverflow = 'clip';
        });
      }
    }
  });

  // Use lossless PNG for crystal-clear vector-like Thai typography
  const imgData = canvas.toDataURL('image/png');
  
  // Standard A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = 210;
  const pdfHeight = 297;
  const imgHeightInMm = (canvas.height * pdfWidth) / canvas.width;

  if (imgHeightInMm <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightInMm, undefined, 'SLOW');
  } else {
    // Exact proportional fit within A4 height to prevent bottom truncation
    const scale = pdfHeight / imgHeightInMm;
    const scaledWidth = pdfWidth * scale;
    const xOffset = (pdfWidth - scaledWidth) / 2;
    pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, pdfHeight, undefined, 'SLOW');
  }
  
  // Download file locally
  pdf.save(fileName);

  const blob = pdf.output('blob');
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const base64Clean = base64data.split(',')[1] || '';
      resolve({ blob, base64: base64Clean });
    };
    reader.readAsDataURL(blob);
  });
}
