import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { Buffer } from 'buffer';
import { Md5 } from "md5-typescript";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export function reverseString(str: string) {
  return str.split('').reverse().join('');
}

// window.btoa();
export function convertToBase64(value: string): string {
  const buffer = Buffer.from(value);
  return buffer.toString('base64');
}

// window.atob();
export function convertFromBase64(value: string): string {
  const buffer = Buffer.from(value, 'base64');
  return buffer.toString();
}

export function hashString(value: string): string {
  return Md5.init(value);
}

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
    FormsModule,
    SharedModule,
    MatCommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.css'
})
export class ToolboxComponent {
  content = '# hello world';
  encryptSource = 'hello';
  encryptResult = '';
  decryptSource = '';
  decryptResult = '';

  encrypt(): void {
    console.log(this.encryptSource);
    this.encryptResult = convertToBase64(this.encryptSource);
    console.log(this.encryptResult);
    console.log(hashString(this.encryptSource));

    console.log(generateUniqueId(6));
  }

  decrypt(): void {
    if (this.decryptSource !== '') {
      this.decryptResult = convertFromBase64(this.decryptSource);
    }
  }

  openPage(): void {
    window.open('https://www.cloud77.top');
  }

  reverseString(script: 'js' | 'ts') {
    console.log(script);
    const reversed = reverseString(this.content);
    console.log(reversed);
    this.content = reversed;
  }
}
