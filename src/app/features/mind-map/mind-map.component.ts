import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MindMapStateService } from '../../core/services/mind-map-state.service';
import { MindMapNode } from '../../core/models/node.model';

@Component({
  selector: 'app-mind-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mind-map.component.html',
  styleUrls: ['./mind-map.component.css'],
  animations: [
    trigger('nodeAnimation', [
      state('inactive', style({ opacity: 0.7, transform: 'scale(0.95)' })),
      state('active', style({ opacity: 1, transform: 'scale(1)' })),
      transition('inactive <=> active', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ]
})
export class MindMapComponent implements OnInit {
  private stateService = inject(MindMapStateService);

  rootNode = this.stateService.rootNode;
  selectedNode = this.stateService.selectedNode;

readonly domainPositions = computed(() => {
  const root = this.rootNode();
  if (!root?.children) return [];

  const centerX = 50;
  const centerY = 50;
  const radius = 30;
  const step = (2 * Math.PI) / root.children.length;

  return root.children.map((domain, i) => {
    const angle = i * step - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return {
      node: domain,
      transform: `translate(${x} ${y})`,
      x,
      y,
      angle
    };
  });
});

  ngOnInit(): void {}

  onNodeClick(node: MindMapNode, event: Event): void {
    event.stopPropagation();
    this.stateService.selectNode(node);
  }

  isNodeActive(nodeId: string): boolean {
    const selected = this.selectedNode();
    return !!selected && selected.id === nodeId;
  }

  getNodeAnimationState(nodeId: string): string {
    return this.isNodeActive(nodeId) ? 'active' : 'inactive';
  }
}
