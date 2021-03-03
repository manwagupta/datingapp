import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/Pagination';
import { MembersService } from 'src/app/_Services/members.service';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.css']
})
export class MemberlistComponent implements OnInit {
member:Member[];
pagination:Pagination;
pageNumber=1;
pageSize=5;


  constructor(private memberservice: MembersService) { }

  ngOnInit(): void {
    this.members$ = this.memberservice.getMembers();
  }
members
  load
}
