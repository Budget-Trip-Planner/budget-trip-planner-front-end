import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { setProposalsFromApi, getProposals } from '../models/proposal.mock';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private useMock = true; // true = mock local, false = vraie API

  constructor(private http: HttpClient) {}

  createTrip(data: any): Observable<any[]> {
    console.log(
      'JSON envoyé à l’API :\n' +
      JSON.stringify(data, null, 2)
    );

    if (this.useMock) {
      console.log('🧪 MOCK MODE ACTIVE');
      return of(getProposals()).pipe(delay(600));
    }

    return this.http.post<any>(
      `${environment.apiUrl}/proposals/generate`,
      data
    ).pipe(
      tap(res => {
        console.log('API RESPONSE:', res);
        setProposalsFromApi(res);
      }),
      map(() => getProposals())
    );
  }
}
