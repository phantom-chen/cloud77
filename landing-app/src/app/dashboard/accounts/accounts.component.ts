import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserAccount } from '@phantom-chen/cloud77';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {
  accounts: UserAccount[] = [
    {
      name: 'Account 1', email: 'abc', existing: true, confirmed: true, profile: {
        surname: '',
        givenName: '',
        city: '',
        phone: '',
        company: '',
        companyType: '',
        title: '',
        contact: '',
        fax: '',
        post: '',
        supplier: ''
      }
    },
  ];

  pageIndex = 0;
  pageSize = 10;
  listLength = 999;

  pageChanged(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    console.warn('to refresh data');
    
  }
}
