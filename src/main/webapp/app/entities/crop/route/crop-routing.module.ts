import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CropComponent } from '../list/crop.component';
import { CropDetailComponent } from '../detail/crop-detail.component';
import { CropUpdateComponent } from '../update/crop-update.component';
import { CropRoutingResolveService } from './crop-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const cropRoute: Routes = [
  {
    path: '',
    component: CropComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CropDetailComponent,
    resolve: {
      crop: CropRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CropUpdateComponent,
    resolve: {
      crop: CropRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CropUpdateComponent,
    resolve: {
      crop: CropRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cropRoute)],
  exports: [RouterModule],
})
export class CropRoutingModule {}
