import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

interface User {
  lastName: string;
  firstName: string;
  username: string;
  mail: string;
  phoneNumber: string;
  birthday: string;
  location: Location;
}

interface Location {
  city: string;
  country: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;

  constructor() {}

  ngOnInit() {
    this.user = {
      lastName: 'François',
      firstName: 'Hollande',
      username: 'Flamby',
      mail: 'flamby@gmail.com',
      phoneNumber: '0123456789',
      birthday: '02/22/2002',
      location: { country: 'France', city: 'Roubaix'}
    };
  }

  onSubmit() {
    if(this.user) console.log(this.user);
  }
}
