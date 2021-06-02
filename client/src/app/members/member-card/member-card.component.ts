import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/_Services/members.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() member: Member;
  constructor(private membserService: MembersService, private toaster: ToastrService) { }
  
  ngOnInit(): void {
  }

  addLike(member: Member) {
    this.membserService.addLike(member.username).subscribe(() => {
      this.toaster.success('You have liked ' + member.knownAs);
    })
  }
}
