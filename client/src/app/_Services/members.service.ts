import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pipe } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/Pagination';
import { User } from '../models/user';
import { UserParams } from '../models/userParams';
import { AccountService } from './account.service';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  member: Member[] = [];
  memberCache = new Map();
  user: User;
  userparams: UserParams;

  constructor(private httpClient: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userparams = new UserParams(user)
    })
  }

  getUserParams() {
    return this.userparams;
  }

  setUserParams(params: UserParams) {
    this.userparams = params;
  }

  resetUserParams() {
    this.userparams = new UserParams(this.user);
    return this.userparams;
  }

  getMembers(userParams: UserParams) {

    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);

    }
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params).
      pipe(map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response)
        return response
      }))
  }

  private getPaginatedResult<T>(url, params) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.httpClient.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, element) => arr.concat(element.result), []).
      find((member: Member) => member.username === username);
    if (member) {
      return of(member);
    }
    return this.httpClient.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.httpClient.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.member.indexOf(member);
        this.member[index] = member;
      })
    );
  }

  setMainPhoto(photoId: Number) {
    return this.httpClient.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: Number) {
    return this.httpClient.delete(this.baseUrl + 'users/delete-photo/' + photoId, {});
  }

  addLike(userName: string)
  {
    return this.httpClient.post(this.baseUrl + "likes/" + userName, {})
  }

  getLikes(predicate: string, pageNumber, pageSize) {
    let params = this.getPaginationHeaders(pageNumber,pageSize);
    params = params.append('predicate', predicate);
    return this.getPaginatedResult<Partial<Member[]>>(this.baseUrl+'likes',params)
  }
}
