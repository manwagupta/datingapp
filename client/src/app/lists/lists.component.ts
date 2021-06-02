import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';
import { Pagination } from '../models/Pagination';
import { MembersService } from '../_Services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  members: Partial<Member[]>;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 2;
  pagination: Pagination;

  constructor(private memberservice: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberservice.getLikes(this.predicate,this.pageNumber,this.pageSize)
    .subscribe(response => { this.members = response.result;
    this.pagination = response.pagination; })
  }

  pageChanged(event: any){
    this.pageNumber = event.page;
    this.loadLikes();

  }

}
