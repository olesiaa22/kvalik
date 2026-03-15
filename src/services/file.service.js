class FileService {
  download(gcodeString, fileName = "program.gcode") {
    const blob = new Blob([gcodeString], { type: "text/plain" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const fileService = new FileService();
