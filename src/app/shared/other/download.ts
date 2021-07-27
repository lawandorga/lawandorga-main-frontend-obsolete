import { HttpResponse } from '@angular/common/http';

export default function downloadFile(response: HttpResponse<Blob>, name: string): void {
  const filename: string = name;
  const binaryData = [];
  binaryData.push(response.body);
  const file = new Blob(binaryData);
  if (name.split('.').pop() === 'pdf') {
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl);
  } else {
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(file);
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
