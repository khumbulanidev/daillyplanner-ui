import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageReloadService {

  constructor() { }

  reloadPage(){
    window.location.reload();
  }
}
