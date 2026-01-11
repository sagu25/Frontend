import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MindMapStateService } from '../../core/services/mind-map-state.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-content-panel',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './content-panel.component.html',
  styleUrls: ['./content-panel.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('contentChange', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(0.98)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ContentPanelComponent {
  private stateService = inject(MindMapStateService);

  selectedNode = this.stateService.selectedNode;
  sidebarVisible = this.stateService.sidebarVisible;
}
