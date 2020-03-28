import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
    FILES_FRONT_URL,
    GetFolderFrontUrlAbsolute,
    GetFolderFrontUrlRelative
} from '../../../statics/frontend_links.statics';
import { Router } from '@angular/router';

@Component({
    selector: 'app-path-information',
    templateUrl: './path-information.component.html',
    styleUrls: ['./path-information.component.scss']
})
export class PathInformationComponent implements OnInit, OnChanges {
    @Input()
    path: string;

    parts: string[];

    constructor(private router: Router) {}

    ngOnInit() {
        this.getParts(this.path);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.path){
            this.getParts(changes.path.currentValue)
        }
    }

    getParts(path: string) {
        this.parts = path.split('/');
    }

    onPartClick(part: string){
        let newLink = '';
        for (const currentPart of this.parts){
            if (newLink !== '')
                newLink = newLink + '/' + currentPart;
            else
                newLink = currentPart;
            if (currentPart === part){
               break
            }
        }
        // console.log('clicked on path: ', newLink);
        this.router.navigateByUrl(GetFolderFrontUrlAbsolute(newLink)).catch(error => {
            console.log('error at redirecting: ', error);
        });
    }

    onHomeCLick(){
        this.router.navigateByUrl(FILES_FRONT_URL);
    }
}
