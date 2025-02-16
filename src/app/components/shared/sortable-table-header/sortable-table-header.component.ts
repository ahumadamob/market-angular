// sortable-table-header.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[appSortableTableHeader]',
  imports: [CommonModule],
  templateUrl: './sortable-table-header.component.html',
  styleUrls: ['./sortable-table-header.component.css']
})
export class SortableTableHeaderComponent<T> {
  @Input() data: T[] = [];
  @Input() sortableColumns: { field: keyof T; display: string }[] = [];
  @Output() sortedData = new EventEmitter<T[]>();

  sortDirection: { [key in keyof T]?: 'asc' | 'desc' } = {};

  sortColumn(column: keyof T) {
    this.sortDirection[column] = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    const direction = this.sortDirection[column] === 'asc' ? 1 : -1;

    const sortedData = [...this.data].sort((a, b) => {
      const valueA = a[column] ?? '';
      const valueB = b[column] ?? '';

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * direction;
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * direction;
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return (valueA.getTime() - valueB.getTime()) * direction;
      } else {
        return 0;
      }
    });

    this.sortedData.emit(sortedData);
  }
}
