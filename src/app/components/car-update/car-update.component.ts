import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { Car } from 'src/app/models/car';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-car-update',
  templateUrl: './car-update.component.html',
  styleUrls: ['./car-update.component.css']
})
export class CarUpdateComponent {
  brands : Brand[];
  colors : Color[];
  selectedCar : Car;
  updateCarForm : FormGroup;


  constructor(private formBuilder : FormBuilder,private carService : CarService, private toastrService : ToastrService,private brandService : BrandService,
    private colorService : ColorService,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.getBrands();
    this.getColors();
    this.createUpdateCarForm();

    this.activatedRoute.params.subscribe(params =>{
      if(params["carId"]){
        let id = + params["carId"];
        this.carService.getByCarId(id).subscribe(response=>{
            this.selectedCar = response.data;
            this.updateCarForm.patchValue(this.selectedCar);
        })
      }
    })
  }

  createUpdateCarForm(){
    this.updateCarForm = this.formBuilder.group({
      id: new FormControl({ value: '', disabled: true }, Validators.required),
      brandId: + ["",Validators.required],
      colorId : + ["",Validators.required],
      modelYear : ["",Validators.required],
      dailyPrice : ["",Validators.required],
      description:["",Validators.required]

    })
  }

  update(){
    const carId =Number(this.activatedRoute.snapshot.paramMap.get('carId'));

    if(this.updateCarForm.valid){
      let updatedCar : Car = this.updateCarForm.value as Car;
      updatedCar.id=carId;
      console.log(updatedCar)
      this.carService.update(updatedCar).subscribe({
        next:(response)=>{
          this.toastrService.success("Araç bilgileri başarıyla güncellendi..")
        },
        error:(responseError)=>{
          console.log(updatedCar)
          if(responseError.error.ValidationErrors){

            for (let i = 0; i < responseError.error.ValidationErrors.length; i++) {

              this.toastrService.error(responseError.error.ValidationErrors[i].ErrorMessage,"Doğrulama Hatası")
            }

          }
          else {
            this.toastrService.error(responseError.error.Message,"Hata")
          }
        }
      }


      )
    }
    else{
      this.toastrService.error("Lütfen alanları doğru şekilde doldurun")
    }
  }

  getBrands(){
    this.brandService.getBrands().subscribe(response =>{
      this.brands = response.data
    })
  }
  getColors(){
    this.colorService.getColors().subscribe(response => {
      this.colors = response.data
    })
  }

}
