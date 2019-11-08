import {Injectable, NgZone} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) {}

  public showNotif(message, action = 'error', duration = 4000): void {
    this.snackBar.open(message, action, { duration }).onAction().subscribe(() => {
      console.log('Notififcation action performed');
    });
  }





}

