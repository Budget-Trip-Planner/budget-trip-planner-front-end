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
  imageUrl: string;
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
  defaultAvatar: string = '/profile-icon.png'

  constructor() {}

  ngOnInit() {
    this.user = {
      lastName: 'François',
      firstName: 'Hollande',
      username: 'Flamby',
      mail: 'flamby@gmail.com',
      phoneNumber: '0123456789',
      birthday: '02/22/2002',
      location: { country: 'France', city: 'Roubaix'},
      imageUrl: 'https://i.pinimg.com/736x/a2/5b/3b/a25b3b53ac2a118bb6b2571d5369d2d5.jpg'
    };
  }

  onSubmit() {
    if(this.user) console.log(this.user);
  }
}
