import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PlotComponent } from './list/plot.component';
import { PlotDetailComponent } from './detail/plot-detail.component';
import { PlotUpdateComponent } from './update/plot-update.component';
import { PlotDeleteDialogComponent } from './delete/plot-delete-dialog.component';
import { PlotRoutingModule } from './route/plot-routing.module';

@NgModule({
  imports: [SharedModule, PlotRoutingModule],
  declarations: [PlotComponent, PlotDetailComponent, PlotUpdateComponent, PlotDeleteDialogComponent],
})
export class PlotModule {}
