import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: "./dashboard.html",
  styleUrl: './dashboard.component.css',

})
export class DashboardComponent {

constructor(private Router: Router) {}

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();

    this.Router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.Router.navigate(['/auth']);
    });
  }
}
