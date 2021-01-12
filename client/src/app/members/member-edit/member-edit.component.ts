import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/_Services/account.service';
import { MembersService } from 'src/app/_Services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editform: NgForm;
  member: Member;
  user: User;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editform.dirty)
      $event.returnValue = true;
  }

  constructor(private account: AccountService, private memberService: MembersService, private toast: ToastrService) {
    this.account.currentUser$.pipe(take(1)).subscribe(user => { this.user = user });
  }

  ngOnInit(): void {
    this.getmember();
  }

  getmember() {
    this.memberService.getMember(this.user.username).subscribe(mem => this.member = mem);
  }

  editMember() {
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toast.success('Profile updated succefully');
      this.editform.reset(this.member);
    })    
  }

}
