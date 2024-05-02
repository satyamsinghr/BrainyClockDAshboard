import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private lastUrlSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public lastUrl$: Observable<string> = this.lastUrlSubject.asObservable();

  private sidebarVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public sidebarVisible$: Observable<boolean> = this.sidebarVisibleSubject.asObservable();

  constructor() { }

  setLastUrl(url: string): void {
    this.lastUrlSubject.next(url);
  }

  toggleSidebarVisibility(visible: boolean): void {
    this.sidebarVisibleSubject.next(visible);
  }
}