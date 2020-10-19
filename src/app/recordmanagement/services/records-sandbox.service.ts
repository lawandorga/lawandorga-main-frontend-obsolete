/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2019  Dominik Walser
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
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { RecordsState } from '../store/records.reducers';
import {
    AddRecordDocument,
    ResetFullClientInformation,
    ResetPossibleClients,
    SetSpecialRecordRequestState,
    StartAddingNewRecord,
    StartAddingNewRecordMessage,
    StartAdmittingRecordPermissionRequest,
    StartDecliningRecordPermissionRequest,
    StartEnlistingPoolConsultant,
    StartLoadingClientPossibilities,
    StartLoadingRecordDeletionRequests,
    StartLoadingRecordPermissionRequests,
    StartLoadingRecordPool,
    StartLoadingRecords,
    StartLoadingRecordStatics,
    StartLoadingSpecialRecord,
    StartProcessingRecordDeletionRequest,
    StartRequestingReadPermission,
    StartRequestingRecordDeletion,
    StartSavingRecord,
    StartSettingRecordDocumentTags,
    StartYieldingRecord
} from '../store/actions/records.actions';
import { FullClient } from '../models/client.model';
import { OriginCountry } from '../models/country.model';
import { RestrictedUser } from '../../core/models/user.model';
import { Tag } from '../models/tag.model';
import { CoreSandboxService } from '../../core/services/core-sandbox.service';
import { FullRecord, RestrictedRecord } from '../models/record.model';
import { StorageService } from '../../shared/services/storage.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { CoreState } from '../../core/store/core.reducers';
import { RecordPermissionRequest } from '../models/record_permission.model';
import { RECORDS_FRONT_URL } from '../../statics/frontend_links.statics';
import { State } from '../../core/models/state.model';
import { RecordDeletionRequest } from '../models/record_deletion_request.model';
import { RecordDocument } from '../models/record_document.model';
import {
    PROCESS_RECORD_DOCUMENT_DELETION_REQUESTS,
    RECORD_DOCUMENT_DELETIONS_API_URL
} from '../../statics/api_urls.statics';
import { RecordDocumentDeletionRequest } from '../models/reocrd_document_deletion_request.model';

@Injectable({
    providedIn: 'root'
})
export class RecordsSandboxService {
    record_permission_requests: Observable<RecordPermissionRequest[]> = this.recordStore.pipe(
        select((state: any) => state.records.admin.recod_permission_requests)
    );

    constructor(
        private router: Router,
        private recordStore: Store<RecordsState>,
        private coreSB: CoreSandboxService,
        private snackbarService: SnackbarService,
        private storageService: StorageService,
        private location: Location,
        private http: HttpClient
    ) {}

    startLoadingRecords(searchParams: SearchParamsInterface): void {
        this.recordStore.dispatch(new StartLoadingRecords(searchParams));
    }

    getRecords(asArray: boolean = true): Observable<RestrictedRecord[] | any> {
        return this.recordStore.pipe(
            select((state: any) => {
                const values = state.records.records;
                return asArray ? Object.values(values) : values;
            })
        );
    }

    getPossibleClients(asArray: boolean = true): Observable<FullClient[] | any> {
        return this.recordStore.pipe(
            select((state: any) => {
                const values = state.records.possible_clients;
                return asArray ? Object.values(values) : values;
            })
        );
    }

    getConsultants(asArray: boolean = true): Observable<RestrictedUser[] | any> {
        return this.recordStore.pipe(
            select((state: any) => {
                const values = state.records.consultants;
                return asArray ? Object.values(values) : values;
            })
        );
    }

    startEnlistingPoolConsultant() {
        this.recordStore.dispatch(new StartEnlistingPoolConsultant());
    }

    getPoolRecords(): Observable<number | any> {
        return this.recordStore.pipe(
            select((state: any) => {
                return state.records.pool_records;
            })
        );
    }

    getUsersPoolEnlistings(): Observable<number | any> {
        return this.recordStore.pipe(
            select((state: any) => {
                return state.records.users_pool_enlistings;
            })
        );
    }

    getPoolConsultants(): Observable<number | any> {
        return this.recordStore.pipe(
            select((state: any) => {
                return state.records.pool_consultants;
            })
        );
    }

    getRecordTags(asArray: boolean = true): Observable<Tag[] | any> {
        return this.recordStore.pipe(
            select((state: any) => {
                const values = state.records.record_tags;
                return asArray ? Object.values(values) : values;
            })
        );
    }

    getRecordDocumentTags(asArray: boolean = true): Observable<Tag[] | any> {
        return this.recordStore.pipe(
            select((state: any) => {
                const values = state.records.record_document_tags;
                return asArray ? Object.values(values) : values;
            })
        );
    }

    getRecordStates(asArray: boolean = true): Observable<State[]> {
        return this.recordStore.pipe(
            select((state: any) => {
                const values = state.records.record_states;
                return asArray ? Object.values(values) : values;
            })
        );
    }

    getSpecialPossibleClient(id: string): FullClient {
        let returnClient: FullClient = null;
        this.recordStore
            .pipe(
                take(1),
                select(
                    (state: any) =>
                        // state.records.possible_clients.find(
                        //     client => client.id === id
                        // )
                        state.records.possible_clients[id]
                )
            )
            .subscribe(state => (returnClient = state));
        return returnClient;
    }

    loadAndGetSpecialRecord(id: string): Observable<any> {
        this.recordStore.dispatch(new StartLoadingSpecialRecord(id));
        return this.recordStore.pipe(select((state: any) => state.records.special_record));
    }

    getSpecialRecord(): Observable<any> {
        return this.recordStore.pipe(select((state: any) => state.records.special_record));
    }

    getOriginCountryById(id: string): OriginCountry {
        let originCountry: OriginCountry = null;
        this.recordStore
            .pipe(
                take(1),
                select((state: any) => state.records.origin_countries[id])
            )
            .subscribe(country => (originCountry = country));
        return originCountry;
    }

    getRecordStateByAbbreviation(abbreviation: string): State {
        let recordState: State = null;
        this.recordStore
            .pipe(
                take(1),
                select((state: any) => state.records.record_states[abbreviation])
            )
            .subscribe(recState => (recordState = recState));

        return recordState;
    }

    loadClientPossibilities(birthday: Date) {
        this.recordStore.dispatch(new StartLoadingClientPossibilities(birthday));
    }

    startLoadingRecordStatics() {
        this.recordStore.dispatch(new StartLoadingRecordStatics());
    }

    startYieldingRecord(record: FullRecord) {
        this.recordStore.dispatch(new StartYieldingRecord(record));
    }

    resetPossibleClients(): void {
        this.recordStore.dispatch(new ResetPossibleClients());
    }

    getOriginCountries(asArray: boolean = true): Observable<OriginCountry[] | any> {
        return this.recordStore.pipe(
            select((state: any) => {
                const values = state.records.origin_countries;
                return asArray ? Object.values(values) : values;
            })
        );
    }

    createNewRecord(
        createFormValues: any,
        client: FullClient,
        originCountry: OriginCountry,
        consultants: RestrictedUser[],
        tags: Tag[]
    ): void {
        const newRecord = {
            //...newRecord,
            client_birthday: CoreSandboxService.transformDateToString(
                new Date(createFormValues.client_birthday)
            ),
            client_name: createFormValues.client_name,
            client_phone_number: createFormValues.client_phone_number,
            client_note: createFormValues.client_note,
            first_contact_date: CoreSandboxService.transformDateToString(
                new Date(createFormValues.first_contact_date)
            ),
            record_token: createFormValues.record_token,
            record_note: createFormValues.record_note,
            consultants: consultants ? consultants.map(consultant => consultant.id) : '',
            tags: tags ? tags.map(tag => tag.id) : [],
            origin_country: originCountry.id
        };

        this.recordStore.dispatch(new StartAddingNewRecord(newRecord));
    }

    successfullyCreatedRecord(response: any): void {
        this.coreSB.showSuccessSnackBar('you successfully created the record');
        this.router.navigate([RECORDS_FRONT_URL]);
        // do more
    }

    successfullySavedRecord(response: any): void {
        this.coreSB.showSuccessSnackBar('you successfully saved the record');
        // do more
    }

    startSavingRecord(toSave: any, record_id: number): void {
        this.recordStore.dispatch(
            new StartSavingRecord({ data: toSave, id: record_id.toString() })
        );
    }

    goBack(): void {
        this.location.back();
    }

    uploadRecordDocuments(files: File[]) {
        let record_id = null;
        this.recordStore
            .pipe(select((state: any) => state.records.special_record.record))
            .subscribe(record => {
                record_id = record.id;
            });
        this.storageService.uploadEncryptedRecordDocuments(files, record_id, response => {
            const documents = RecordDocument.getRecordDocumentsFromJsonArray(response);
            for (const document of documents) {
                this.recordStore.dispatch(new AddRecordDocument(document));
            }
        });
    }

    downloadRecordDocument(document: RecordDocument): void {
        this.storageService.downloadEncryptedRecordDocument(document);
    }

    downloadAllRecordDocuments(): void {
        let record_id = null;
        let record_token = null;
        this.recordStore
            .pipe(select((state: any) => state.records.special_record.record))
            .subscribe(record => {
                record_id = record.id;
                record_token = record.token;
            });
        this.storageService.downloadAllEncryptedRecordDocuments(record_id, record_token);
    }

    startAddingNewRecordMessage(message: string): void {
        this.recordStore.dispatch(new StartAddingNewRecordMessage(message));
    }

    showError(error_message: string): void {
        this.coreSB.showErrorSnackBar(error_message);
    }

    startSettingDocumentTags(tags: Tag[], document_id: string) {
        this.recordStore.dispatch(new StartSettingRecordDocumentTags({ tags, document_id }));
    }

    startRequestReadPermission(restrictedRecord: RestrictedRecord): void {
        this.recordStore.dispatch(new StartRequestingReadPermission(restrictedRecord));
        this.recordStore.dispatch(new SetSpecialRecordRequestState('re'));
    }

    startLoadingRecordPermissionRequests(): void {
        this.recordStore.dispatch(new StartLoadingRecordPermissionRequests());
    }

    getRecordPermissionRequests(
        asArray: boolean = true
    ): Observable<RecordPermissionRequest[] | any> {
        return this.recordStore.pipe(
            select((state: any) => {
                const values = state.records.admin.record_permission_requests;
                return asArray ? Object.values(values) : values;
            })
        );
    }

    getSpecialRecordPermissionRequest(id: string): Observable<RecordPermissionRequest> {
        return this.recordStore.pipe(
            select((state: any) => state.records.admin.record_permission_requests[id])
        );
    }

    admitRecordPermissionRequest(request: RecordPermissionRequest): void {
        this.recordStore.dispatch(new StartAdmittingRecordPermissionRequest(request));
    }

    declineRecordPermissionRequest(request: RecordPermissionRequest): void {
        this.recordStore.dispatch(new StartDecliningRecordPermissionRequest(request));
    }

    resetFullClientInformation(): void {
        this.recordStore.dispatch(new ResetFullClientInformation());
    }

    getSpecialRecordRequestState(): Observable<string> {
        return this.recordStore.pipe(
            select((state: any) => state.records.special_record.request_state)
        );
    }

    startRequestingRecordDeletion(record: RestrictedRecord, explanation: string): void {
        this.recordStore.dispatch(new StartRequestingRecordDeletion({ record, explanation }));
    }

    startLoadingRecordDeletionRequests(): void {
        this.recordStore.dispatch(new StartLoadingRecordDeletionRequests());
    }

    getRecordDeletionRequests(asArray: boolean = true): Observable<RecordDeletionRequest[] | any> {
        return this.recordStore.pipe(
            select((state: any) => {
                const values = state.records.admin.record_deletion_requests;
                return asArray ? Object.values(values) : values;
            })
        );
    }

    declineRecordDeletionRequest(request: RecordDeletionRequest): void {
        this.recordStore.dispatch(
            new StartProcessingRecordDeletionRequest({ request, action: 'decline' })
        );
    }

    admitRecordDeletionRequest(request: RecordDeletionRequest): void {
        this.recordStore.dispatch(
            new StartProcessingRecordDeletionRequest({ request, action: 'accept' })
        );
    }

    startLoadingRecordPool() {
        this.recordStore.dispatch(new StartLoadingRecordPool());
    }

    startRequestingRecordDocumentDeletion(document: RecordDocument, text: string): void {
        this.http
            .post(RECORD_DOCUMENT_DELETIONS_API_URL, {
                document_id: document.id,
                explanation: text
            })

            .pipe(
                tap(
                    response => {
                        this.snackbarService.showSuccessSnackBar('deletion successfully requested');
                        return [];
                    },
                    error => {
                        if (error['error']['error_code'] === 'api.already_requested') {
                            this.snackbarService.showErrorSnackBar('deletion already requested');
                        }
                        return [];
                    }
                )
            )
            .subscribe(() => {});
    }

    getRecordDocumentDeletionRequestsFromServer(): Promise<RecordDocumentDeletionRequest[]> {
        return this.http
            .get<any>(RECORD_DOCUMENT_DELETIONS_API_URL)
            .toPromise()
            .then(result => {
                return RecordDocumentDeletionRequest.getRecordDocumentDeletionRequestsFromJsonArray(
                    result
                );
            });
    }

    acceptRecordDocumentDeletionRequest(
        deletion_request: RecordDocumentDeletionRequest
    ): Promise<any> {
        return this.http
            .post<any>(PROCESS_RECORD_DOCUMENT_DELETION_REQUESTS, {
                request_id: deletion_request.id,
                action: 'accept'
            })
            .toPromise();
    }

    declineRecordDocumentDeletionRequest(
        deletion_request: RecordDocumentDeletionRequest
    ): Promise<any> {
        return this.http
            .post<any>(PROCESS_RECORD_DOCUMENT_DELETION_REQUESTS, {
                request_id: deletion_request.id,
                action: 'decline'
            })
            .toPromise();
    }
}
