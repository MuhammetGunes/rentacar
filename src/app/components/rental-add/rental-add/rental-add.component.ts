import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, Form } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-rental-add',
  templateUrl: './rental-add.component.html',
  styleUrls: ['./rental-add.component.css']
})
export class RentalAddComponent {
  rentalAddForm : FormGroup;
  constructor(private formBuilder:FormBuilder, private rentalService:RentalService, private toastrService:ToastrService){}

  ngOnInit(): void{
    this.createRentalAddForm();
  }

  createRentalAddForm(){
    this.rentalAddForm = this.formBuilder.group({
      carId:["",Validators.required],
      customerId:["",Validators.required],
      rentDate:["",Validators.required],
      returnDate:["",Validators.required]
    })
  }

  add(){
    if(this.rentalAddForm.valid){
      let rentalModel = Object.assign({},this.rentalAddForm.value)
      this.rentalService.add(rentalModel).subscribe(response=>{
        console.log(response)
        this.toastrService.success("Ürün eklendi..","Başarılı")
      })

    }else{
      this.toastrService.error("Formunuz eksik..","Hata!")
    }

  }
}
