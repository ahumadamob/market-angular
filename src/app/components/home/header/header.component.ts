import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  
  constructor(private router: Router) {}
  
  goToUsers(): void {
    this.router.navigate(['/user']);
  }

  goToAdjustmentConfigs(): void {
    this.router.navigate(['/adjustment-config']);
  }  
}
