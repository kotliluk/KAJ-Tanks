/**
 * FileDialog for loading files to the application.
 */
export class FileDialog {

  /**
   * Loads asynchronously a PNG file as Base64 URL string.
   *
   * @param maxBs maximum allowed size of image in bites (default 1024)
   */
  public static openPNG(maxBs: number = 2048): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let element = document.createElement('div');
      element.innerHTML = `<input type="file" accept='.png'>`;
      let fileInput = element.firstChild;
      // @ts-ignore
      fileInput.addEventListener('change', function() {
        // @ts-ignore
        let file = fileInput.files[0];
        if (file.size > maxBs) {
          console.log(`Maximal image size (${maxBs} bytes) exceeded: ${file.size} bytes`);
          return reject(`Maximal image size (${maxBs} bytes) exceeded: ${file.size} bytes`);
        }
        if (!file.name.toLowerCase().endsWith(".png")) {
          console.log("Unsupported image type. Please, use PNG image.");
          return reject("Unsupported image type. Please, use PNG image.");
        }
        let reader = new FileReader();
        reader.onload = function() {
          // @ts-ignore
          const url: string = reader.result;
          resolve(url);
        };
        reader.readAsDataURL(file);
      });
      // @ts-ignore
      fileInput.click();
    });
  }
}