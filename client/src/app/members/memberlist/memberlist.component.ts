import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/_Services/members.service';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.css']
})
export class MemberlistComponent implements OnInit {
members$: Observable<Member[]>;


  constructor(private memberservice: MembersService) { }

  ngOnInit(): void {
    this.members$ = this.memberservice.getMembers();
  }
}
