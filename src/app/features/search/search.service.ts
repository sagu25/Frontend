import { Injectable, inject, computed } from '@angular/core';
import { signal } from '@angular/core';
import { MindMapStateService } from '../../core/services/mind-map-state.service';
import { MindMapNode } from '../../core/models/node.model';

export interface SearchResult {
  node: MindMapNode;
  score: number;
  matchedFields: string[];
  highlightedTitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private stateService = inject(MindMapStateService);

  searchQuery = signal<string>('');
  isSearchActive = signal<boolean>(false);

  searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const rootNode = this.stateService.rootNode();

    if (!query || query.length < 2 || !rootNode) {
      return [];
    }

    const allNodes = this.flattenNodes(rootNode);
    const results = allNodes
      .map(node => this.scoreNode(node, query))
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Limit to top 10 results

    return results;
  });

  private flattenNodes(node: MindMapNode): MindMapNode[] {
    const nodes: MindMapNode[] = [];

    // Skip root node in search
    if (node.type !== 'root') {
      nodes.push(node);
    }

    if (node.children) {
      node.children.forEach(child => {
        nodes.push(...this.flattenNodes(child));
      });
    }

    return nodes;
  }

  private scoreNode(node: MindMapNode, query: string): SearchResult {
    let score = 0;
    const matchedFields: string[] = [];
    const title = node.title.toLowerCase();
    const description = node.description?.toLowerCase() || '';
    const content = this.getContentText(node).toLowerCase();

    // Exact match in title - highest score
    if (title === query) {
      score += 100;
      matchedFields.push('title-exact');
    }
    // Title starts with query
    else if (title.startsWith(query)) {
      score += 75;
      matchedFields.push('title-start');
    }
    // Title contains query
    else if (title.includes(query)) {
      score += 50;
      matchedFields.push('title');
    }
    // Fuzzy match in title
    else if (this.fuzzyMatch(title, query)) {
      score += 30;
      matchedFields.push('title-fuzzy');
    }

    // Description matches
    if (description.includes(query)) {
      score += 25;
      matchedFields.push('description');
    } else if (this.fuzzyMatch(description, query)) {
      score += 15;
      matchedFields.push('description-fuzzy');
    }

    // Content matches
    if (content.includes(query)) {
      score += 10;
      matchedFields.push('content');
    }

    // Boost domain nodes slightly
    if (node.type === 'domain') {
      score *= 1.2;
    }

    return {
      node,
      score,
      matchedFields,
      highlightedTitle: this.highlightMatches(node.title, query)
    };
  }

  private fuzzyMatch(text: string, query: string): boolean {
    let queryIndex = 0;
    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
      if (text[i] === query[queryIndex]) {
        queryIndex++;
      }
    }
    return queryIndex === query.length;
  }

  private highlightMatches(text: string, query: string): string {
    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private getContentText(node: MindMapNode): string {
    if (!node.content) return '';

    const parts: string[] = [];

    if (node.content.overview) {
      parts.push(node.content.overview);
    }
    if (node.content.keyFeatures) {
      parts.push(...node.content.keyFeatures);
    }
    if (node.content.benefits) {
      parts.push(...node.content.benefits);
    }
    if (node.content.useCases) {
      parts.push(...node.content.useCases);
    }
    if (node.content.technologies) {
      parts.push(...node.content.technologies);
    }

    return parts.join(' ');
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.isSearchActive.set(false);
  }

  selectResult(result: SearchResult): void {
    this.stateService.selectNode(result.node);
    this.clearSearch();
  }
}
