import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserrSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserrSource.asObservable();

  constructor(private httpclient: HttpClient) { }

  login(model: any) {
    return this.httpclient.post(this.baseUrl + "account/login", model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(model: any) {
    return this.httpclient.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
         this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserrSource.next(user);
  }


  logout() {
    localStorage.removeItem('user');
    this.currentUserrSource.next(null);
  }

}
