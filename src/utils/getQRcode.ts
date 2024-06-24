// src/types.ts
export enum FrameTypes {
  finalized = 'finalizado',
  designs = 'diseños',
}

export let qrCodeLoading: string =
  "https://firebasestorage.googleapis.com/v0/b/cartas-a-bris.appspot.com/o/qr%2Fqr-loading.gif?alt=media&token=9de90db0-b6f6-4f4d-8970-b8e7f24afcf7";

const QR_API_URL: string =
  "https://api.qrserver.com/v1/create-qr-code/?data=";

export async function getQRCode(baseUrl: string, designId: string, frameType: FrameTypes): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await fetch(
          `${QR_API_URL}${baseUrl}/${frameType}/${designId}`
        );
        resolve(response.url);
      } catch (error) {
        console.log(error);
        reject(new Error('Request failed'));
      }
    }, 500);
  });
}