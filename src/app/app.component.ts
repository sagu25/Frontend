import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MindMapComponent } from './features/mind-map/mind-map.component';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { ContentPanelComponent } from './features/content-panel/content-panel.component';
import { AiAvatarComponent } from './features/ai-avatar/ai-avatar.component';
import { MindMapStateService } from './core/services/mind-map-state.service';
import { MindMapDataService } from './core/services/mind-map-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MindMapComponent,
    SidebarComponent,
    ContentPanelComponent,
    AiAvatarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private stateService = inject(MindMapStateService);
  private dataService = inject(MindMapDataService);

  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.dataService.loadMindMapData().subscribe({
      next: (data) => {
        this.stateService.setRootNode(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(`Failed to load mind map data: ${err.message || 'Unknown error'}`);
        this.isLoading.set(false);
        console.error('Error loading data:', err);
      }
    });
  }
}
