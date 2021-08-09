import { HttpResponse } from '@angular/common/http';

export default function downloadFile(response: HttpResponse<Blob>, name: string): void {
  const filename: string = name;
  if (name.split('.').pop() === 'pdf') {
    const fileUrl = window.URL.createObjectURL(response.body);
    window.open(fileUrl);
  } else {
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(response.body);
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
