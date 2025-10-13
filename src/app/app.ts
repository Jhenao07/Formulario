import { Component, signal } from '@angular/core';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ AuthFormComponent, RouterOutlet ],

  template: `<router-outlet></router-outlet>`,
})
export class App {

}
