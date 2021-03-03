import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/Pagination';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  member: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  constructor(private httpClient: HttpClient) {

  }

  getMembers(page?: number, itemPerPage?: number) {
    let params = new HttpParams();
    if(page !== null && itemPerPage !== null){
      params = params.append('pageNumber',page.toString());
      params = params.append('pageSize',itemPerPage.toString());
    }
    return this.httpClient.get<Member[]>(this.baseUrl + 'users',{observe: 'response', params}).pipe( 
      map(response =>{
        this.paginatedResult.result = response.body;
        if(response.headers.get('Pagination') !== null){
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return this.paginatedResult;
      })
    )
  }

  getMember(username: string) {
    const member = this.member.find(x => x.username === username)
    if (member !== undefined) return of(member);
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
}
