

import { Injectable } from '@angular/core';

export type AppView = 'employees' | 'leaves' | 'expenses';

@Injectable({
  providedIn: 'root'
})
export class ViewStateService {
  public lastView: AppView = 'employees';

  constructor() { }
}
