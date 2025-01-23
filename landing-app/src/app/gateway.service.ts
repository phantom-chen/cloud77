import { HttpClient } from "@angular/common/http";
import { mockupData } from "./storage";
import { lastValueFrom } from "rxjs";
import { Injectable } from "@angular/core";

export interface IGatewayService {
    getSite(): Promise<string>;
}

@Injectable()
export class GatewayService implements IGatewayService {

    constructor(private http: HttpClient) {}

    getSite(): Promise<string> {
        if (mockupData()) {
            return Promise.resolve('https://www.google.com');
        }
        
        return lastValueFrom(this.http.get('/resources/site.json', { responseType: 'text' }))
    }
}