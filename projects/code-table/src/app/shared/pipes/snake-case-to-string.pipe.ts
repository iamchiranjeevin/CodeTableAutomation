import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeCaseToString',
})
export class SnakeCaseToStringPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
