import { Injectable } from '@angular/core';
import { TripRequest } from '../models/home';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TripResponse } from '../models/home';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }
  createTrip(data: any): Observable<TripResponse[]> {
    console.log(
      'JSON envoyé à l’API :\n' +
      JSON.stringify(data, null, 2)
    );
    return this.http.post<TripResponse[]>(
      `${environment.apiUrl}/proposals/generate`,
      data
    );
  }

}

