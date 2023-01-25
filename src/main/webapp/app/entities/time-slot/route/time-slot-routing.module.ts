import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TimeSlotComponent } from '../list/time-slot.component';
import { TimeSlotDetailComponent } from '../detail/time-slot-detail.component';
import { TimeSlotUpdateComponent } from '../update/time-slot-update.component';
import { TimeSlotRoutingResolveService } from './time-slot-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const timeSlotRoute: Routes = [
  {
    path: '',
    component: TimeSlotComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TimeSlotDetailComponent,
    resolve: {
      timeSlot: TimeSlotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TimeSlotUpdateComponent,
    resolve: {
      timeSlot: TimeSlotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TimeSlotUpdateComponent,
    resolve: {
      timeSlot: TimeSlotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(timeSlotRoute)],
  exports: [RouterModule],
})
export class TimeSlotRoutingModule {}
