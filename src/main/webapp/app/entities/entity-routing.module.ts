import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'plot',
        data: { pageTitle: 'irrigationApp.plot.home.title' },
        loadChildren: () => import('./plot/plot.module').then(m => m.PlotModule),
      },
      {
        path: 'crop',
        data: { pageTitle: 'irrigationApp.crop.home.title' },
        loadChildren: () => import('./crop/crop.module').then(m => m.CropModule),
      },
      {
        path: 'sensor',
        data: { pageTitle: 'irrigationApp.sensor.home.title' },
        loadChildren: () => import('./sensor/sensor.module').then(m => m.SensorModule),
      },
      {
        path: 'time-slot',
        data: { pageTitle: 'irrigationApp.timeSlot.home.title' },
        loadChildren: () => import('./time-slot/time-slot.module').then(m => m.TimeSlotModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
