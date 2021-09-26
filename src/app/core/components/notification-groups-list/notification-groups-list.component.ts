import { AfterViewInit, Component, EventEmitter, ViewChild } from '@angular/core';
import { merge, Observable, of } from 'rxjs';
import { AppSandboxService } from '../../services/app-sandbox.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NOTIFICATION_GROUPS_API_URL } from '../../../statics/api_urls.statics';
import { NotificationGroup } from '../../models/notification_group.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NotificationGroupType } from '../../models/notification.enum';
import { Filterable } from '../../../shared/models/filterable.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { DecrementNotificationCounter } from '../../store/core.actions';

@Component({
  selector: 'app-notification-groups-list',
  templateUrl: './notification-groups-list.component.html',
  styleUrls: ['./notification-groups-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      // transition('expanded <=> collapsed', animate('290ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
      transition('collapsed <=> expanded', animate('300ms ease-in')),
      // transition('expanded <=> collapsed', animate('1000ms ease-in'))
    ]),
  ],
})
export class NotificationGroupsListComponent implements AfterViewInit {
  columns = ['read', 'last_activity', 'text'];

  data: NotificationGroup[] = [];
  expandedElement: NotificationGroup | null;
  results_length = 0;

  filterValuesObservable: Observable<FilterableTypes[]> = this.generateFilterableTypes();
  currentFilterValues: FilterableTypes[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  change = new EventEmitter(); // TODO: maybe reload with timer? every x seconds, last updated

  constructor(private appSB: AppSandboxService, private router: Router, private httpClient: HttpClient, private store: Store<AppState>) {}

  ngAfterViewInit() {
    merge(this.sort.sortChange, this.paginator.page, this.change)
      .pipe(
        startWith({}),
        switchMap(() => {
          // this.isLoadingResults = true;
          return this.getNotifications(
            this.paginator.pageSize,
            this.paginator.pageSize * this.paginator.pageIndex,
            this.sort.active,
            this.sort.direction
          );
        }),
        map((data: NotificationResponse) => {
          this.results_length = data.count;
          return data;
        }),
        catchError((error) => {
          return [];
        })
      )
      .subscribe((data: NotificationResponse) => {
        this.data = NotificationGroup.getNotificationGroupsFromJsonArray(data.results);
      });
  }

  getNotifications(limit: number, offset: number, sort_active: string, sort_direction: string): Observable<NotificationResponse> {
    const filtersAsStrings: string[] = [];
    for (const currentFilter of this.currentFilterValues) {
      filtersAsStrings.push(currentFilter.name);
    }
    const filterString = filtersAsStrings.join('___');

    const requestUrl = `${NOTIFICATION_GROUPS_API_URL}?limit=${limit}&offset=${offset}&sort=${sort_active}&sortdirection=${sort_direction}&filter=${filterString}`;
    return this.httpClient.get<NotificationResponse>(requestUrl);
  }

  selectedFilterChanged(event: FilterableTypes[]): void {
    this.currentFilterValues = event;
    this.change.emit();
  }

  onReadClick(event, notificationGroup: NotificationGroup): void {
    event.stopPropagation();
    const toPost = {
      read: true,
    };
    this.httpClient.patch(`${NOTIFICATION_GROUPS_API_URL}${notificationGroup.id}/`, toPost).subscribe((response) => {
      this.store.dispatch(new DecrementNotificationCounter());

      for (const notification of notificationGroup.notifications) {
        notification.read = true;
      }
      notificationGroup.read = true;
    });
  }

  generateFilterableTypes(): Observable<FilterableTypes[]> {
    const list = [];
    for (const name of Object.keys(NotificationGroupType)) {
      list.push(new FilterableTypes(name));
    }
    return of(list);
  }
}

interface NotificationResponse {
  results: NotificationGroup[];
  count: number;
  next: string;
  previous: string;
}

class FilterableTypes implements Filterable {
  public readonly toShow: string;

  getFilterableProperty() {
    return this.toShow;
  }

  constructor(public readonly name: string) {
    this.name = name;
    this.toShow = name.toLowerCase().split('_').join(' ');
  }
}
