export interface File {
  name: string,
  text: string | null
}

/**
 * FileDialog for loading files to the application.
 */
export class FileDialog {

  /**
   * Loads asynchronously a PNG file as Base64 URL string.
   *
   * @param maxBs maximum allowed size of image in bites (default 1024)
   * @param maxW maximum allowed width of image in pixels (default 24)
   * @param maxH maximum allowed height of image in pixels (default 24)
   */
  public static openPNG(maxBs: number = 2048, maxW: number = 24, maxH: number = 24): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let element = document.createElement('div');
      element.innerHTML = `<input type="file" accept='.png'>`;
      let fileInput = element.firstChild;
      // @ts-ignore
      fileInput.addEventListener('change', function() {
        // @ts-ignore
        let file = fileInput.files[0];
        if (file.size > maxBs) {
          console.log("Image size exceeded.");
          return reject("Image size exceeded.");
        }
        if (!file.name.toLowerCase().endsWith(".png")) {
          console.log("Unsupported image type.");
          return reject("Unsupported image type.");
        }
        let reader = new FileReader();
        reader.onload = function() {
          // @ts-ignore
          const url: string = reader.result;
          checkImageSize(url, maxW, maxH).then(ok => {
            if (ok) {
              resolve(url);
            }
            else {
              console.log("Image width and height exceeded.");
              reject("Image width and height exceeded.");
            }
          })
        };
        reader.readAsDataURL(file);
      });
      // @ts-ignore
      fileInput.click();
    });
  }
}

function checkImageSize(url: string, maxW: number, maxH: number): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      resolve(image.width <= maxW && image.height <= maxH);
    };
  });
}