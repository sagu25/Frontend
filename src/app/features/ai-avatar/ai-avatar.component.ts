import { Component, OnInit, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MindMapStateService } from '../../core/services/mind-map-state.service';

@Component({
  selector: 'app-ai-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-avatar.component.html',
  styleUrls: ['./ai-avatar.component.css'],
  animations: [
    trigger('float', [
      state('*', style({ transform: 'translateY(0)' })),
      transition('* => *', [
        animate('3s ease-in-out', style({ transform: 'translateY(-10px)' })),
        animate('3s ease-in-out', style({ transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('600ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('messageChange', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class AiAvatarComponent implements OnInit {
  private stateService = inject(MindMapStateService);

  greetingMessage = signal('Hello! I\'m your AI Experience Agent.');
  subMessage = signal('Click any node to explore intelligent solutions');
  showTooltip = signal(true);
  isContextual = signal(false);

  private defaultGreetings = [
    'Hello! I\'m your AI Experience Agent.',
    'Welcome to the future of AI-powered solutions!',
    'Let me guide you through intelligent experiences.',
    'Ready to explore AI capabilities?'
  ];

  private defaultSubMessages = [
    'Click any node to explore intelligent solutions',
    'Discover transformative AI technologies',
    'Navigate through domains and subtopics',
    'Experience the power of AI integration'
  ];

  private rotationInterval: any;

  constructor() {
    // Watch for node selection changes
    effect(() => {
      const selectedNode = this.stateService.selectedNode();
      if (selectedNode) {
        this.updateContextualMessage(selectedNode);
      }
    });
  }

  ngOnInit(): void {
    this.startDefaultRotation();
    setTimeout(() => this.showTooltip.set(false), 8000);
  }

  private updateContextualMessage(node: any): void {
    this.isContextual.set(true);
    this.showTooltip.set(true);

    // Clear rotation interval when showing contextual message
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }

    let greeting = '';
    let subMsg = '';

    switch (node.type) {
      case 'root':
        greeting = 'Welcome to AI Experience Agent!';
        subMsg = 'Choose a domain to explore: Sustainability, Strategy, or Digital Operations';
        break;

      case 'domain':
        const domainMessages: { [key: string]: { greeting: string, sub: string } } = {
          'sustainability-mobility': {
            greeting: '🌱 Exploring Sustainability & Mobility',
            sub: 'Discover eco-friendly solutions and smart transportation systems'
          },
          'strategy-growth': {
            greeting: '📈 Diving into Strategy & Growth',
            sub: 'Unlock business intelligence and market insights'
          },
          'digital-operations': {
            greeting: '⚙️ Exploring Digital & Operations',
            sub: 'Transform operations with intelligent automation'
          }
        };
        const domainMsg = domainMessages[node.id] || { greeting: `Exploring ${node.title}`, sub: node.description };
        greeting = domainMsg.greeting;
        subMsg = domainMsg.sub;
        break;

      case 'subtopic':
        greeting = `💡 ${node.title}`;
        subMsg = node.description || 'Explore the details in the content panel';

        // Add specific insights for known subtopics
        if (node.content?.benefits && node.content.benefits.length > 0) {
          subMsg = node.content.benefits[0];
        }
        break;
    }

    this.greetingMessage.set(greeting);
    this.subMessage.set(subMsg);

    // Auto-hide tooltip after 10 seconds
    setTimeout(() => {
      if (this.isContextual()) {
        this.showTooltip.set(false);
      }
    }, 10000);
  }

  private startDefaultRotation(): void {
    let index = 0;
    this.rotationInterval = setInterval(() => {
      if (!this.isContextual()) {
        index = (index + 1) % this.defaultGreetings.length;
        this.greetingMessage.set(this.defaultGreetings[index]);
        this.subMessage.set(this.defaultSubMessages[index]);
      }
    }, 6000);
  }

  onAvatarClick(): void {
    this.showTooltip.update(v => !v);
  }

  ngOnDestroy(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }
}
