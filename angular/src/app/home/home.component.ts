import { Component,OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Chart, registerables} from 'chart.js'
Chart.register(...registerables)


import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  data: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getData().subscribe(
      response => {
        this.data = response;
        console.log(this.data); // Log the data to the console for debugging
        if (this.data) {
          this.Renderchart(); // Render the chart after data is fetched
        } else {
          console.error('No data received from API');
        }
      },
      error => {
        console.error('Error fetching data:', error); // Log errors if any
      }
    );
  }

  Renderchart(): void {
    if (!this.data) {
      console.error('Data is not available');
      return;
    }

    const labels = ['Air Force', 'Army', 'Navy'];
    const data = [
      this.data.airforce_count,
      this.data.army_count,
      this.data.navy_count
    ];

    const mychart = new Chart('piechart', {
      type: 'pie', // Set chart type to 'pie' for a pie chart
      data: {
        labels: labels,
        datasets: [{
          label: 'Sainik Distribution',
          data: data,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem: any) {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              }
            }
          }
        }
      }
    });
  }
}