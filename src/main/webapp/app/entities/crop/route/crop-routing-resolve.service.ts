import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICrop } from '../crop.model';
import { CropService } from '../service/crop.service';

@Injectable({ providedIn: 'root' })
export class CropRoutingResolveService implements Resolve<ICrop | null> {
  constructor(protected service: CropService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICrop | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((crop: HttpResponse<ICrop>) => {
          if (crop.body) {
            return of(crop.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
