import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CropComponent } from './list/crop.component';
import { CropDetailComponent } from './detail/crop-detail.component';
import { CropUpdateComponent } from './update/crop-update.component';
import { CropDeleteDialogComponent } from './delete/crop-delete-dialog.component';
import { CropRoutingModule } from './route/crop-routing.module';

@NgModule({
  imports: [SharedModule, CropRoutingModule],
  declarations: [CropComponent, CropDetailComponent, CropUpdateComponent, CropDeleteDialogComponent],
})
export class CropModule {}
