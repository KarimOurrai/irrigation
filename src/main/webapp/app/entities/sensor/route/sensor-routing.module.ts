import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SensorComponent } from '../list/sensor.component';
import { SensorDetailComponent } from '../detail/sensor-detail.component';
import { SensorUpdateComponent } from '../update/sensor-update.component';
import { SensorRoutingResolveService } from './sensor-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const sensorRoute: Routes = [
  {
    path: '',
    component: SensorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SensorDetailComponent,
    resolve: {
      sensor: SensorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SensorUpdateComponent,
    resolve: {
      sensor: SensorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SensorUpdateComponent,
    resolve: {
      sensor: SensorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sensorRoute)],
  exports: [RouterModule],
})
export class SensorRoutingModule {}
