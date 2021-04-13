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

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import {
  SET_ALL_DOCUMENTS,
  SET_COLLAB_PERMISSIONS,
  SET_DOCUMENT_PERMISSIONS,
  START_ADDING_COLLAB_DOCUMENT_PERMISSION,
  START_ADDING_DOCUMENT,
  START_DELETING_COLLAB_DOCUMENT,
  START_DELETING_COLLAB_DOCUMENT_PERMISSION,
  START_LOADING_ALL_DOCUMENTS,
  START_LOADING_COLLAB_DOCUMENT_PERMISSIONS,
  START_LOADING_COLLAB_PERMISSIONS,
  StartAddingCollabDocumentPermission,
  StartAddingDocument,
  StartDeletingCollabDocument,
  StartDeletingCollabDocumentPermission,
  StartLoadingCollabDocumentPermissions,
} from './collab.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import {
  COLLAB_COLLAB_DOCUMENTS_API_URL,
  COLLAB_PERMISSIONS_API_URL,
  GetCollabDocumentPermissionApiUrl,
  GetCollabDocumentPermissionForDocumentApiUrl,
  GetSpecialCollabDocumentApiUrl,
} from '../../statics/api_urls.statics';
import { NameCollabDocument } from '../models/collab-document.model';
import { CollabPermission, CollabPermissionFrom } from '../models/collab_permission.model';
import { HasPermission, Permission } from '../../core/models/permission.model';

@Injectable()
export class CollabEffects {
  constructor(private actions: Actions, private http: HttpClient) {}

  @Effect()
  startLoadingAllDocuments = this.actions.pipe(
    ofType(START_LOADING_ALL_DOCUMENTS),
    switchMap(() => {
      return from(
        this.http.get(COLLAB_COLLAB_DOCUMENTS_API_URL).pipe(
          catchError((err) => {
            return [];
          }),
          mergeMap((response) => {
            const documents = NameCollabDocument.getNameCollabDocumentsFromJsonArray(response);
            return [{ type: SET_ALL_DOCUMENTS, payload: documents }];
          })
        )
      );
    })
  );

  @Effect()
  startAddingDocument = this.actions.pipe(
    ofType(START_ADDING_DOCUMENT),
    map((action: StartAddingDocument) => {
      return action.payload;
    }),
    switchMap((payload: { path: string }) => {
      return from(
        this.http
          .post(COLLAB_COLLAB_DOCUMENTS_API_URL, {
            path: payload.path,
          })
          .pipe(
            catchError((err) => {
              return [];
            }),
            mergeMap((response) => {
              return [{ type: START_LOADING_ALL_DOCUMENTS }];
            })
          )
      );
    })
  );

  @Effect()
  startDeletingDocument = this.actions.pipe(
    ofType(START_DELETING_COLLAB_DOCUMENT),
    map((action: StartDeletingCollabDocument) => {
      return action.payload;
    }),
    switchMap((payload: { id: number }) => {
      return from(
        this.http.delete(GetSpecialCollabDocumentApiUrl(payload.id)).pipe(
          catchError((err) => {
            return [];
          }),
          mergeMap((response) => {
            return [{ type: START_LOADING_ALL_DOCUMENTS }];
          })
        )
      );
    })
  );

  @Effect()
  startLoadingCollabDocumentPermissions = this.actions.pipe(
    ofType(START_LOADING_COLLAB_DOCUMENT_PERMISSIONS),
    map((action: StartLoadingCollabDocumentPermissions) => {
      return action.payload;
    }),
    switchMap((payload: { id: number }) => {
      return from(
        this.http.get(GetCollabDocumentPermissionApiUrl(payload.id)).pipe(
          catchError((err) => {
            return [];
          }),
          mergeMap((response) => {
            const collab_permissions = CollabPermission.getCollabPermissionFromJsonArray(
              response.direct,
              CollabPermissionFrom.Direct
            ).concat(
              ...CollabPermission.getCollabPermissionFromJsonArray(response.from_above, CollabPermissionFrom.Parent),
              ...CollabPermission.getCollabPermissionFromJsonArray(response.from_below, CollabPermissionFrom.Children)
            );
            return [
              {
                type: SET_DOCUMENT_PERMISSIONS,
                payload: {
                  collab_permissions,
                  general_permissions: HasPermission.getPermissionsFromJsonArray(response.general),
                },
              },
            ];
          })
        )
      );
    })
  );

  @Effect()
  startLoadingCollabPermissions = this.actions.pipe(
    ofType(START_LOADING_COLLAB_PERMISSIONS),
    switchMap(() => {
      return from(
        this.http.get(COLLAB_PERMISSIONS_API_URL).pipe(
          catchError((err) => {
            return [];
          }),
          mergeMap((response) => {
            const collab_permissions = Permission.getPermissionsFromJsonArray(response);
            return [
              {
                type: SET_COLLAB_PERMISSIONS,
                payload: collab_permissions,
              },
            ];
          })
        )
      );
    })
  );

  @Effect()
  startAddingCollabDocumentPermission = this.actions.pipe(
    ofType(START_ADDING_COLLAB_DOCUMENT_PERMISSION),
    map((action: StartAddingCollabDocumentPermission) => {
      return action.payload;
    }),
    switchMap((payload: { document_id: number; group_id: string; permission_id: string }) => {
      return from(
        this.http
          .post(GetCollabDocumentPermissionApiUrl(payload.document_id), {
            group_id: payload.group_id,
            permission_id: payload.permission_id,
          })
          .pipe(
            catchError((err) => {
              return [];
            }),
            mergeMap((response) => {
              return [
                {
                  type: START_LOADING_COLLAB_DOCUMENT_PERMISSIONS,
                  payload: { id: response.document },
                },
              ];
            })
          )
      );
    })
  );

  @Effect()
  startDeletingCollabDocumentPermission = this.actions.pipe(
    ofType(START_DELETING_COLLAB_DOCUMENT_PERMISSION),
    map((action: StartDeletingCollabDocumentPermission) => {
      return action.payload;
    }),
    switchMap((payload: { collab_document_permission_id: number }) => {
      return from(
        this.http.delete(GetCollabDocumentPermissionForDocumentApiUrl(payload.collab_document_permission_id)).pipe(
          catchError((err) => {
            return [];
          }),
          mergeMap((response) => {
            return [];
          })
        )
      );
    })
  );
}
