import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.css']
})
export class ProfileDialogComponent implements OnInit {
  dialogForm: FormGroup;
  status: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.status = data.status;
  }

  ngOnInit() {
    this.dialogForm = this.fb.group({
      description: [this.status, []]
    });
  }

  save() {
    this.dialogRef.close(this.dialogForm.value);
  }

  close() {
    this.dialogRef.close();
  }
}
