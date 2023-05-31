import { Injectable } from '@angular/core';
import {AngularFireStorageModule} from "@angular/fire/compat/storage";

@Injectable({
  providedIn: 'root'
})
export class ServiceStorageService {

  constructor(private  storage: AngularFireStorageModule) { }
}
