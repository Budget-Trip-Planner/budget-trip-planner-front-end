import {Component, Input} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {Voyage} from '../../../core/services/trip/trip.service';

@Component({
  selector: 'app-trip-card',
  imports: [CommonModule, DatePipe],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent {
  @Input() trip!: Voyage;
}
