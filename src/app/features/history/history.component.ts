import {Component, OnInit} from '@angular/core';
import {TripCardComponent} from '../../shared/components/trip-card/trip-card.component';
import {CommonModule} from '@angular/common';
import {User, UserService} from '../../core/services/user/user.service';
import {TripService, Voyage} from '../../core/services/trip/trip.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule,TripCardComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})

export class HistoryComponent implements OnInit {
  user: User | null =  null;

  pastTrips : Voyage[] = [];

  constructor(
    public userService: UserService,
    private tripService: TripService
  ) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => this.user = user);
    this.tripService.getPastTrips().subscribe(trips => {
      this.pastTrips = trips;
    })
  };
}
