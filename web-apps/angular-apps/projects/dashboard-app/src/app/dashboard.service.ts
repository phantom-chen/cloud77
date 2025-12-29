import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountQueryResult, EventQueryResult } from '@phantom-chen/cloud77';
import { GatewayService } from '@shared/utils';
import { lastValueFrom, Observable } from 'rxjs';

export interface BaseQuery {
  sort: string; // desc or asc;TODO; shall use enum later, 0: desc, 1: asc
  index: number;
  size: number;
}

export interface AccountQuery extends BaseQuery {
  email: string;
  role: string;
}

export type AppSetting = {
    key: string,
    value: string,
    description: string
}

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) {
    console.log('DashboardService initialized');
    this.gateway = new GatewayService(this.http);
  }

  gateway: GatewayService;

  getAccounts(query: AccountQuery): Observable<AccountQueryResult | undefined> {
    const params = new HttpParams().set('index', query.index).set('size', query.size).set('role', query.role);
    return this.http.get<AccountQueryResult>('/api/super/accounts', { params });
  }

  getEvents(name: string, index: number, size: number): Observable<EventQueryResult | undefined> {
    const params: HttpParams = new HttpParams().set('name', name).set('index', index.toString()).set('size', size.toString());
    return this.http.get<EventQueryResult>('api/super/events', { params });
  }

  getSettings(): Observable<AppSetting[]> {
    return this.http.get<AppSetting[]>('/api/super/settings');
  }

  getSetting(key: string): Observable<AppSetting> {
    return this.http.get<AppSetting>(`/api/super/settings/${key}`);
  }
}
