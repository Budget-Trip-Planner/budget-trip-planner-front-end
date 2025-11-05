import { Component } from '@angular/core';
import { Router } from '@angular/router';;
import { TripResponse } from '../../core/models/home';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proposals',
  imports: [CommonModule],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.css'
})
export class ProposalsComponent {
  trips!:TripResponse[];
  constructor(private router : Router) {
    const state = this.router.getCurrentNavigation()?.extras.state as {trips: TripResponse[]};
    if (state) {
      this.trips = state.trips;
    }
    
  }

  goToProfile() {
    this.router.navigate(['userProfile']);
  }

  selectTrip(trip: TripResponse) {
    this.router.navigate(['dashboard'], { state: { trips: [trip] } });
  }

}
