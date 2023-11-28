import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {Item} from "./item.model";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    items: Item[] = [
        {id: 1, name: 'Option 1'},
        {id: 2, name: 'Option 2'},
        {id: 3, name: 'Option 3'},
        {id: 4, name: 'Option 4'},
        {id: 5, name: 'Option 5'},
        {id: 6, name: 'Option 6'},
        {id: 7, name: 'Option 7'}
    ];

    formControl = new FormControl();
    formGroup!: FormGroup;
    selectedValue: number = -1;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            selectFormControlName: [''],
        });
    }
}
