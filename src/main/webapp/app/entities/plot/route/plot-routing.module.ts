import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PlotComponent } from '../list/plot.component';
import { PlotDetailComponent } from '../detail/plot-detail.component';
import { PlotUpdateComponent } from '../update/plot-update.component';
import { PlotRoutingResolveService } from './plot-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const plotRoute: Routes = [
  {
    path: '',
    component: PlotComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlotDetailComponent,
    resolve: {
      plot: PlotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlotUpdateComponent,
    resolve: {
      plot: PlotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlotUpdateComponent,
    resolve: {
      plot: PlotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(plotRoute)],
  exports: [RouterModule],
})
export class PlotRoutingModule {}
