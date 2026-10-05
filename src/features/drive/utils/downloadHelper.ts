/**
 * Reliable cross-origin file downloader for Drive assets (PDFs, Images, DOCX, ZIPs, etc.)
 */
export const downloadDriveFile = async (url: string, fileName: string): Promise<void> => {
  try {
    let downloadUrl = url;
    if (url.includes("cloudinary.com")) {
      if (url.includes("/raw/upload/")) {
        downloadUrl = url.replace("/raw/upload/", "/raw/upload/fl_attachment/");
      } else if (url.includes("/image/upload/")) {
        downloadUrl = url.replace("/image/upload/", "/image/upload/fl_attachment/");
      }
    }

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error("Network fetch failed");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 1000);
  } catch (err) {
    // Fallback: Trigger Cloudinary attachment URL download directly
    let fallbackUrl = url;
    if (url.includes("cloudinary.com")) {
      fallbackUrl = url.replace("/upload/", "/upload/fl_attachment/");
    }
    const a = document.createElement("a");
    a.href = fallbackUrl;
    a.download = fileName;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
