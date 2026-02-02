import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ContactMessage } from '../../models/contact';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ContactService {
  private readonly apiUrl = `${environment.apiUrl}/contact`;
  constructor(private http: HttpClient) {}
  sendMessage(message: ContactMessage): Observable<void> {
    return this.http.post<void>(this.apiUrl, message);
  }
}
