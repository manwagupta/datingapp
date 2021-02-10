import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_Services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  @Output() cancelRegister = new EventEmitter()
  registerForms: FormGroup;
  maxDate:Date;

  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.InitializeForm();
    this.maxDate= new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
  }

  InitializeForm(){
    this.registerForms = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required,this.matchValues('password')]]
    });
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value? null : {isMatching : true}
    }
  }

  regsiter() {
    console.log(this.registerForms.value);
    // this.accountService.register(this.model).subscribe(response => {
    //   console.log(response);
    //   this.cancel();
    // }, error => {
    //   console.log(error);
    //   this.toastr.error(error.error)
    // });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
