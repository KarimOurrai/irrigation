import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITimeSlot } from '../time-slot.model';

@Component({
  selector: 'jhi-time-slot-detail',
  templateUrl: './time-slot-detail.component.html',
})
export class TimeSlotDetailComponent implements OnInit {
  timeSlot: ITimeSlot | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timeSlot }) => {
      this.timeSlot = timeSlot;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
