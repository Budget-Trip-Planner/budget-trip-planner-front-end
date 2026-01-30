import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proposals',
  imports: [CommonModule],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.css'
})
export class ProposalsComponent {
  trips!: any[];

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state as { trips: any[] };

    if (state) {
      this.trips = state.trips;
    }
  }

  goToProfile() {
    this.router.navigate(['userProfile']);
  }

  selectTrip(trip: any) {
    this.router.navigate(['dashboard'], { state: { trips: [trip] } });
  }
}
