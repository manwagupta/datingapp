import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberdetailComponent } from './members/memberdetail/memberdetail.component';
import { MemberlistComponent } from './members/memberlist/memberlist.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path:'',
    runGuardsAndResolvers:'always',
    canActivate:[AuthGuard],
    children:[{ path: 'members', component: MemberlistComponent,canActivate:[AuthGuard] },
    { path: 'members/:id', component: MemberdetailComponent },
    { path: 'lists', component: ListsComponent },
    { path: 'messages', component: MessagesComponent }]
  },
  { path: '**', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
