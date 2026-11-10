import {Routes} from '@angular/router';
import {MainwindowComponent} from './component/mainwindow/mainwindow.component';

export const routes: Routes = [
  {path: 'home', redirectTo: '/main/gpacalculator', pathMatch: 'full'},
  {path: '', redirectTo: '/main/gpacalculator', pathMatch: 'full'},
  {
    path: 'main', component: MainwindowComponent, children: [
      {
        path: 'gpacalculator', title: 'BIT GPA Calculator',
        loadComponent: () => import('./component/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'progression', title: 'Progress report · BIT GPA Calculator',
        loadComponent: () => import('./component/progressionpage/progressionpage.component').then(m => m.ProgressionpageComponent),
      },
      {
        path: 'contactus', title: 'Contact us · BIT GPA Calculator',
        loadComponent: () => import('./component/contact-us/contact-us.component').then(m => m.ContactUsComponent),
      },
      {
        path: 'about', title: 'About · BIT GPA Calculator',
        loadComponent: () => import('./component/about/about.component').then(m => m.AboutComponent),
      },
    ],
  },
  {path: '**', redirectTo: '/main/gpacalculator'},
];
