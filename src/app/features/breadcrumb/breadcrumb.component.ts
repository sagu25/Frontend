import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { MindMapStateService } from '../../core/services/mind-map-state.service';
import { MindMapNode } from '../../core/models/node.model';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class BreadcrumbComponent {
  private stateService = inject(MindMapStateService);

  selectedNode = this.stateService.selectedNode;
  selectedDomain = this.stateService.selectedDomain;
  rootNode = this.stateService.rootNode;

  breadcrumbs = computed(() => {
    const selected = this.selectedNode();
    const domain = this.selectedDomain();
    const root = this.rootNode();
    const crumbs: MindMapNode[] = [];

    if (!selected || !root) {
      return crumbs;
    }

    // Always include root
    crumbs.push(root);

    // Add domain if we have one
    if (domain) {
      crumbs.push(domain);
    }

    // Add subtopic if selected node is a subtopic
    if (selected.type === 'subtopic') {
      crumbs.push(selected);
    }

    return crumbs;
  });

  onBreadcrumbClick(node: MindMapNode): void {
    this.stateService.selectNode(node);
  }
}
