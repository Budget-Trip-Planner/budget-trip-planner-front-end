import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface User {
  lastName: string;
  firstName: string;
  username: string;
  mail: string;
  phoneNumber: string;
  birthday: string;
  location: Location;
  imageUrl: string;
}

export interface Location {
  city: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private mockUser: User = {
    lastName: 'François',
    firstName: 'Hollande',
    username: 'Flamby',
    mail: 'flamby@gmail.com',
    phoneNumber: '0123456789',
    birthday: '02/22/2002',
    location: { country: 'France', city: 'Roubaix'},
    imageUrl: 'https://i.pinimg.com/736x/a2/5b/3b/a25b3b53ac2a118bb6b2571d5369d2d5.jpg'
  };

  private currentUserSubject = new BehaviorSubject<User>(this.mockUser);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  public getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  public updateUser(updatedUser: User): Observable<User> {
    this.mockUser = {...this.mockUser, ...updatedUser};
    this.currentUserSubject.next(updatedUser);
    console.log(this.currentUserSubject.value);
    return of(this.mockUser);
  }
}
