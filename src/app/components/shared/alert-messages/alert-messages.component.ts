import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-messages',
  imports: [CommonModule],
  templateUrl: './alert-messages.component.html',
  styleUrls: ['./alert-messages.component.css']
})
export class AlertMessagesComponent {
  @Input() messages: { type: string; field?: string, content: string }[] = [];

  getAlertClass(type: string): string {
    switch (type) {
      case 'ERROR': return 'alert alert-dismissible alert-danger';
      case 'WARNING': return 'alert alert-dismissible alert-warning';
      case 'INFO': return 'alert alert-dismissible alert-primary';
      case 'SUCCESS': return 'alert alert-dismissible alert-success';
      default: return 'alert alert-dismissible alert-secondary';
    }
  }
}
