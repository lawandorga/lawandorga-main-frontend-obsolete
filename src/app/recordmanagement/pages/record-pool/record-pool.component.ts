import { Component, OnInit } from '@angular/core';
import { RecordsSandboxService } from '../../services/records-sandbox.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-record-pool',
    templateUrl: './record-pool.component.html',
    styleUrls: ['./record-pool.component.scss']
})
export class RecordPoolComponent implements OnInit {
    consultants: number;
    records: number;


    constructor(private recordSB: RecordsSandboxService) {
    }

    ngOnInit() {
        this.recordSB.startLoadingRecordPool();
        this.recordSB.getPoolConsultants().subscribe((consultants: number) => {
            this.consultants = consultants;
        });
        this.recordSB.getPoolRecords().subscribe((records: number) => {
            this.records = records;
        });

    }

    onEnlistClick(){
        this.recordSB.startEnlistingPoolConsultant();
    }
}
