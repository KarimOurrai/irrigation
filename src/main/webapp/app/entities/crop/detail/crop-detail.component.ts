import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICrop } from '../crop.model';

@Component({
  selector: 'jhi-crop-detail',
  templateUrl: './crop-detail.component.html',
})
export class CropDetailComponent implements OnInit {
  crop: ICrop | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ crop }) => {
      this.crop = crop;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
