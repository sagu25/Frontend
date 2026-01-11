import { Component, OnInit, inject, computed, signal, ElementRef, ViewChild } from '@angular/core';
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
      state('inactive', style({ opacity: 0.7 })),
      state('active', style({ opacity: 1 })),
      transition('inactive <=> active', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ]
})
export class MindMapComponent implements OnInit {
  private stateService = inject(MindMapStateService);

  @ViewChild('svgElement') svgElement!: ElementRef<SVGElement>;

  rootNode = this.stateService.rootNode;
  selectedNode = this.stateService.selectedNode;

  // Zoom state
  zoomLevel = signal(1);
  minZoom = 0.5;
  maxZoom = 2;
  zoomStep = 0.25;

  // Touch state for pinch-to-zoom
  private touchDistance = 0;

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

  isDomainOfSelectedSubtopic(domainId: string): boolean {
    const selected = this.selectedNode();
    if (!selected || selected.type !== 'subtopic') return false;

    const root = this.rootNode();
    const domain = root?.children?.find(d => d.id === domainId);
    return !!domain?.children?.some(subtopic => subtopic.id === selected.id);
  }

  getNodeAnimationState(nodeId: string): string {
    return this.isNodeActive(nodeId) || this.isDomainOfSelectedSubtopic(nodeId) ? 'active' : 'inactive';
  }

  // Zoom Controls
  zoomIn(): void {
    const newZoom = Math.min(this.zoomLevel() + this.zoomStep, this.maxZoom);
    this.zoomLevel.set(newZoom);
  }

  zoomOut(): void {
    const newZoom = Math.max(this.zoomLevel() - this.zoomStep, this.minZoom);
    this.zoomLevel.set(newZoom);
  }

  resetZoom(): void {
    this.zoomLevel.set(1);
  }

  getZoomTransform(): string {
    return `scale(${this.zoomLevel()})`;
  }

  // Touch Events for Pinch-to-Zoom
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      event.preventDefault();
      this.touchDistance = this.getTouchDistance(event.touches);
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2) {
      event.preventDefault();
      const currentDistance = this.getTouchDistance(event.touches);
      const scale = currentDistance / this.touchDistance;

      let newZoom = this.zoomLevel() * scale;
      newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));

      this.zoomLevel.set(newZoom);
      this.touchDistance = currentDistance;
    }
  }

  private getTouchDistance(touches: TouchList): number {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
