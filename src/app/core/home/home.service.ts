import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TripResponse } from '../models/home';
import { environment } from '../../../environments/environment';
import { PROPOSALS_MOCK } from '../models/proposal.mock';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private useMock = true;

  constructor(private http: HttpClient) { }

  createTrip(data: any): Observable<any> {
    console.log(
      'JSON envoyé à l’API :\n' +
      JSON.stringify(data, null, 2)
    );

    if (this.useMock) {
        console.log('MOCK MODE ACTIVE – proposal.mock.ts utilisé');
        return of(PROPOSALS_MOCK).pipe(delay(600));
    }

    return this.http.post<TripResponse>(
      `${environment.apiUrl}/proposals/generate`,
      data
    );
  }
}
