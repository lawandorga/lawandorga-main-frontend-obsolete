import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilesSandboxService } from '../../services/files-sandbox.service';
import { FilesTypes, TableEntry } from '../../models/table-entry.model';
import { GetFolderFrontUrlRelative } from '../../../statics/frontend_links.statics';

@Component({
    selector: 'app-folder-view',
    templateUrl: './folder-view.component.html',
    styleUrls: ['./folder-view.component.scss']
})
export class FolderViewComponent implements OnInit {
    entries: TableEntry[] = [];
    path: string;

    @ViewChild("filesInput")
    fileInput: ElementRef<HTMLInputElement>;

    columns = [
        "type",
        "name",
        "size",
        "last_edited",
        "more"
    ];

    constructor(private route: ActivatedRoute, private fileSB: FilesSandboxService, private router: Router) {}

    ngOnInit() {
        this.route.queryParamMap.subscribe(map => {
            if (map.get('path')) {
                this.path = map.get('path');
                console.log('path set: ', this.path);
            } else {
                console.log('root');
                this.path = '';
            }
            this.fileSB.startLoadingFolderInformation(this.path);
        });

        this.fileSB.getFolders().subscribe((folders) => {
            this.entries = this.entries.filter((entry) => {
                return entry.type !== FilesTypes.Folder
            });
            this.entries.push(...folders);
        });
        this.fileSB.getFiles().subscribe((files) => {
            this.entries = this.entries.filter((entry) => {
                return entry.type !== FilesTypes.File
            });
            this.entries.push(...files);
        })
    }

    onEntryClick(entry: TableEntry): void {
        console.log('click on: ', entry);
        if (entry.type === FilesTypes.Folder){
            console.log('new path: ', GetFolderFrontUrlRelative(this.path, entry.name));
            this.router.navigateByUrl(GetFolderFrontUrlRelative(this.path, entry.name)).catch(error => {
                console.log('error at redirecting: ', error);
            });
        }
    }


    dropped($event){
        $event.preventDefault();

        const items = $event.dataTransfer.items;
        const all = [];
        let count = 0;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const entry = item.webkitGetAsEntry();
                if (entry.isFile) {
                    this.parseFileEntry(entry).then(result => {
                        count = count + 1;
                        // console.log('file: ', result);
                        all.push(result);
                        if (count === items.length){
                           this.fileSB.upload(all, this.path);
                           this.fileSB.startLoadingFolderInformation(this.path);
                        }
                    })
                } else if (entry.isDirectory) {
                    this.parseDirectoryEntry(entry).then(result => {
                        count = count + 1;
                        // console.log('folder: ', result);
                        all.push(result);
                        if (count === items.length){
                            this.fileSB.upload(all, this.path);
                            this.fileSB.startLoadingFolderInformation(this.path);

                        }
                    })
                }
            }
        }
        // this.fileSB.upload(all);
    }

    dragover($event) {
        $event.preventDefault();
    }

    parseFileEntry(fileEntry) {
        return new Promise((resolve, reject) => {
            fileEntry.file(
                file => {
                    resolve(file);
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    parseDirectoryEntry(directoryEntry) {
        const directoryReader = directoryEntry.createReader();
        return new Promise((resolve, reject) => {
            directoryReader.readEntries(
                entries => {
                    resolve(entries);
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    onDeleteClick(entry){
        // console.log('i want to delete: ', entry);
        this.fileSB.startDeleting([entry], this.path);
    }

    onDownloadClick(entry){
        // console.log('i want to download: ', entry);
        this.fileSB.startDownloading([entry], this.path);
    }
}
