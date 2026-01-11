import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MindMapStateService } from '../../core/services/mind-map-state.service';
import { MindMapNode } from '../../core/models/node.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('slideIn', [
      state('void', style({
        transform: 'translateX(-100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => *', animate('400ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('* => void', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})
export class SidebarComponent {
  private stateService = inject(MindMapStateService);

  sidebarVisible = this.stateService.sidebarVisible;
  selectedDomain = this.stateService.selectedDomain;
  domainSubtopics = this.stateService.domainSubtopics;
  selectedNode = this.stateService.selectedNode;

  onSubtopicClick(subtopic: MindMapNode): void {
    this.stateService.selectNode(subtopic);
  }

  isSubtopicActive(subtopicId: string): boolean {
    const selected = this.selectedNode();
    return selected?.id === subtopicId;
  }

  onClose(): void {
    this.stateService.closeSidebar();
  }

  onScrollBack(): void {
    // Find the mind-map section and scroll to it
    const mindMapSection = document.querySelector('.mind-map-section');
    if (mindMapSection) {
      this.stateService.closeSidebar();
      mindMapSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
