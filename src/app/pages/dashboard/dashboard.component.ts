import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: "./dashboard.html"

})
export class DashboardComponent {

constructor(private Router: Router) {}

  logout(): void {
    // 1️⃣ Limpia cualquier información de sesión si la tienes
    localStorage.clear(); // opcional si guardas tokens o correos
    sessionStorage.clear();

    // 2️⃣ Redirige al login
    this.Router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.Router.navigate(['/auth']);
    });
  }
}
