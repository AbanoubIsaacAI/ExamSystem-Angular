import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ExamsComponent } from './pages/exams/exams.component';
import { ExamsquestionsComponent } from './pages/examsquestions/examsquestions.component';
import { ScoresComponent } from './pages/scores/scores.component';
import { AdmindashboardComponent } from './pages/admindashboard/admindashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { AddexamComponent } from './pages/addexam/addexam.component';
import { EditexamsComponent } from './pages/editexams/editexams.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'exams', component: ExamsComponent },
  { path: 'exams/:id', component: ExamsquestionsComponent },
  { path: 'addexam', component: AddexamComponent },
  { path: 'editexam/:id', component: EditexamsComponent },
  { path: 'scores', component: ScoresComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'admindashboard',
    component: AdmindashboardComponent,
    canActivate: [AdminGuard],
  },
  { path: '**', component: NotfoundComponent },
];
