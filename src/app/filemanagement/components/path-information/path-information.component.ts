/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2020  Dominik Walser
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FILES_FRONT_URL, GetFolderFrontUrlAbsolute, GetFolderFrontUrlRelative } from '../../../statics/frontend_links.statics';
import { Router } from '@angular/router';

@Component({
  selector: 'app-path-information',
  templateUrl: './path-information.component.html',
  styleUrls: ['./path-information.component.scss'],
})
export class PathInformationComponent implements OnInit, OnChanges {
  @Input()
  path: string;

  parts: string[];
  this_folder: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.getParts(this.path);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.path) {
      this.getParts(changes.path.currentValue);
    }
  }

  getParts(path: string) {
    this.parts = path.split('/');
    this.this_folder = this.parts.pop();
  }

  onPartClick(part: string) {
    let newLink = '';
    for (const currentPart of this.parts) {
      if (newLink !== '') newLink = newLink + '/' + currentPart;
      else newLink = currentPart;
      if (currentPart === part) {
        break;
      }
    }
    this.router.navigateByUrl(GetFolderFrontUrlAbsolute(newLink)).catch((error) => {});
  }

  onHomeCLick() {
    this.router.navigateByUrl(FILES_FRONT_URL);
  }
}
