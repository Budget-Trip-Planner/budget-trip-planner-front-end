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
  createTrip(data : TripRequest):Observable<TripResponse[]> {
    // Version réelle (quand le back sera prêt) :
    //return this.http.post<TripResponse[]>(`${environment.apiUrl}/proposals`, data);
    const mockResponse: TripResponse[] = [
      {
        destination: 'Rome',
        estimatedCost: 850,
        durationDays: data.duration,
        image: '/destination/Rome.png',
        country: 'Italy'
      },
      {
        destination: 'Barcelone',
        estimatedCost: 780,
        durationDays: data.duration,
        image: '/destination/Rome.png',
        country: 'Spain'

      },
      {
        destination: 'Lisbonne',
        estimatedCost: 720,
        durationDays: data.duration,
        image: '/destination/Rome.png',
        country: 'Portugal'

      }
    ];

    return of(mockResponse);
  }

}
