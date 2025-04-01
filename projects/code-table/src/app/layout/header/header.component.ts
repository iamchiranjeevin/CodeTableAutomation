import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatAnchor, MatButton } from '@angular/material/button';
import { HeaderToolbarComponent } from '../header-toolbar/header-toolbar.component';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, MatAnchor, MatButton, HeaderToolbarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
