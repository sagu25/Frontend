import { Injectable, signal, computed } from '@angular/core';
import { MindMapNode } from '../models/node.model';

@Injectable({
  providedIn: 'root'
})
export class MindMapStateService {
  private rootNodeSignal = signal<MindMapNode | null>(null);
  private selectedNodeSignal = signal<MindMapNode | null>(null);
  private expandedDomainsSignal = signal<Set<string>>(new Set());
  private sidebarVisibleSignal = signal<boolean>(false);

  readonly rootNode = this.rootNodeSignal.asReadonly();
  readonly selectedNode = this.selectedNodeSignal.asReadonly();
  readonly expandedDomains = this.expandedDomainsSignal.asReadonly();
  readonly sidebarVisible = this.sidebarVisibleSignal.asReadonly();

  readonly selectedDomain = computed(() => {
    const selected = this.selectedNodeSignal();
    if (!selected) return null;

    if (selected.type === 'domain') {
      return selected;
    }

    if (selected.type === 'subtopic') {
      const root = this.rootNodeSignal();
      return root?.children?.find(domain =>
        domain.children?.some(subtopic => subtopic.id === selected.id)
      ) || null;
    }

    return null;
  });

  readonly domainSubtopics = computed(() => {
    const domain = this.selectedDomain();
    return domain?.children || [];
  });

  setRootNode(node: MindMapNode): void {
    this.rootNodeSignal.set(node);
    this.selectedNodeSignal.set(node);
  }

  selectNode(node: MindMapNode): void {
    this.selectedNodeSignal.set(node);

    if (node.type === 'root') {
      this.sidebarVisibleSignal.set(false);
      this.expandedDomainsSignal.set(new Set());
    } else if (node.type === 'domain') {
      this.toggleDomain(node.id);
      this.sidebarVisibleSignal.set(true);
    } else if (node.type === 'subtopic') {
      this.sidebarVisibleSignal.set(true);
    }
  }

  toggleDomain(domainId: string): void {
    const expanded = new Set(this.expandedDomainsSignal());
    if (expanded.has(domainId)) {
      expanded.delete(domainId);
    } else {
      expanded.clear();
      expanded.add(domainId);
    }
    this.expandedDomainsSignal.set(expanded);
  }

  isDomainExpanded(domainId: string): boolean {
    return this.expandedDomainsSignal().has(domainId);
  }

  closeSidebar(): void {
    this.sidebarVisibleSignal.set(false);
  }
}
