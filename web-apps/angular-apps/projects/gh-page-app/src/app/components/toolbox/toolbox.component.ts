import { Component } from '@angular/core';
import { reverseString } from './reverse-string';
import { convertFromBase64, convertToBase64, hashString } from '@shared/utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const codes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateUniqueId(length: number): string {
  if (length < 3) return '';
  let id = '';
  for (let i = 0; i < length - 1; i++) {
    id += codes.charAt(Math.floor(Math.random() * codes.length));
  }

  return id;
}

@Component({
  selector: 'app-toolbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.css'
})
export class ToolboxComponent {

  name = 'Cory Rylan';
  
  encryptSource = 'hello';
  encryptResult = '';
  decryptSource = '';
  decryptResult = '';
  hashSource = '# hello world';
  hashResult = '';
  id = "";

  reverseString(method: string): void {
    console.log('Toolbox component method called: reverseString');
    if (method === 'ts') {
      this.name = reverseString(this.name);
    } else {
      import('./string-helper').then(module => {
        this.name = module.reverseString(this.name);
      });
    }
  }

  encrypt(): void {
    console.log(this.encryptSource);
    this.encryptResult = convertToBase64(this.encryptSource);
    console.log(this.encryptResult);
  }

  decrypt(): void {
    if (this.decryptSource !== '') {
      this.decryptResult = convertFromBase64(this.decryptSource);
    }
  }

  hash(): void {
    if (this.hashSource) {
      this.hashResult = hashString(this.hashSource);
    }
  }

  generateId(): void {
    this.id = generateUniqueId(6);
  }
}
