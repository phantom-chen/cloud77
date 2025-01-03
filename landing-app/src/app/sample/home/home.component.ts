import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Guid } from 'guid-typescript';
import { SharedModule } from '../../shared/shared.module';
import { Observable, of } from 'rxjs';
import { Person, PERSONS } from './person';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient) {
      this.persons$ = of(PERSONS);
    }
  
  logs: string[] = [];
  current: string = "";
  items: string[] = ['string1', 'string2'];
  repo = '';
  code = '';
  owner = '';
  name = '';
  url = '';
  developer = '';

  persons$: Observable<Person[]>;

  ngOnInit(): void {
    this.current = new Date().toString();
    console.log(this.platformId);
    console.log(isPlatformBrowser(this.platformId));

    this.logs.push(`PlatformId: ${this.platformId}, ${isPlatformBrowser(this.platformId) ? 'Platform browser' : '' }`);
    this.logs.push(`Guid: ${Guid.create().toString()}`);
    this.logs.push('Coming Soon...');
    this.logs.push('page is being visited 100 times.');
    this.http.get('/resources/site.json')
      .subscribe((data: any) => {
        console.log(data);
        this.repo = data.repository;
        this.code = data.code;
        this.owner = data.owner;
        this.name = data.name;
        this.url = data.url;
        this.developer = data.developer;
      });

    this.http.get('/resources/samples/posts.json')
      .subscribe((data: any) => {
        console.log(data);
        this.logs.push(`Posts: ${data.length}`);
      });
  }

  openDialog(name: 'alert' | 'confirm' | 'prompt') {
    console.log(name);
    switch (name) {
      case 'alert':
        alert('wip\n' + name);
        break;
      case 'confirm':
        const confirmed = confirm('wip\n' + name);
        console.log(confirmed);
        break;
      case 'prompt':
        const result = prompt('wip\n' + name, name);
        console.log(result);
        break;
    }    
  }
}
