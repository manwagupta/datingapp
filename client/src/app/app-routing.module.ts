import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './Errors/not-found/not-found.component';
import { ServerErrorComponent } from './Errors/server-error/server-error.component';
import { TestErrosComponent } from './Errors/test-erros/test-erros.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberdetailComponent } from './members/memberdetail/memberdetail.component';
import { MemberlistComponent } from './members/memberlist/memberlist.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [{ path: 'members', component: MemberlistComponent, canActivate: [AuthGuard] },
    { path: 'members/:id', component: MemberdetailComponent },
    { path: 'lists', component: ListsComponent },
    { path: 'messages', component: MessagesComponent }]
  },
  { path: 'errors', component: TestErrosComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
