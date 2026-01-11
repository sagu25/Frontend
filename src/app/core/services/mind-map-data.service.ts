import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MindMapNode } from '../models/node.model';

@Injectable({
  providedIn: 'root'
})
export class MindMapDataService {
  private http = inject(HttpClient);

  loadMindMapData(): Observable<MindMapNode> {
    return this.http.get<MindMapNode>('/assets/data/mind-map-data.json');
  }
}
