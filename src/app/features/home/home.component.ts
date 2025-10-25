import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  preferences = ['Plage', 'Nature', 'Culture', 'Gastronomie', 'Shopping', 'Aventure', 'Bien-être', 'Histoire', 'Romantique','Croisière', 'Luxe', 'Famille', 'Festivals', 'Sport'];
  selectedPreferences : string[] = [];
  errorMessage: string = '';
  togglePreference(preference : string) : void{
    const index = this.selectedPreferences.indexOf(preference);
    if (index >= 0) {
      this.selectedPreferences.splice(index, 1);
    } else {
      this.selectedPreferences.push(preference);
    }

    if(this.selectedPreferences.length > 3){
      this.errorMessage = 'Vous devez choisir au maximum 3 préférences';
    } else {
      this.errorMessage = '';
    }
  }

  getTagColor(preference: string): string {
    const colorMap: { [key: string]: string } = {
      'Plage': 'tag-blue',
      'Nature': 'tag-green',
      'Culture': 'tag-yellow',
      'Gastronomie': 'tag-orange',
      'Shopping': 'tag-purple',
      'Aventure': 'tag-red',
      'Bien-être': 'tag-teal',
      'Histoire': 'tag-brown',
      'Romantique': 'tag-pink',
      'Croisière': 'tag-cyan',
      'Luxe': 'tag-gold',
      'Famille': 'tag-lime',
      'Festivals': 'tag-indigo',
      'Sport': 'tag-silver'
    };
    return colorMap[preference] || 'tag-gray';
  }



}
