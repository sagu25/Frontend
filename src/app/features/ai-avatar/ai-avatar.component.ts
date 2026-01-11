import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
    ])
  ]
})
export class AiAvatarComponent implements OnInit {
  greetingMessage = signal('Hello! I\'m your AI Experience Agent.');
  subMessage = signal('Click any node to explore intelligent solutions');
  showTooltip = signal(true);

  private greetings = [
    'Hello! I\'m your AI Experience Agent.',
    'Welcome to the future of AI-powered solutions!',
    'Let me guide you through intelligent experiences.',
    'Ready to explore AI capabilities?'
  ];

  private subMessages = [
    'Click any node to explore intelligent solutions',
    'Discover transformative AI technologies',
    'Navigate through domains and subtopics',
    'Experience the power of AI integration'
  ];

  ngOnInit(): void {
    this.rotateMessages();
    setTimeout(() => this.showTooltip.set(false), 8000);
  }

  private rotateMessages(): void {
    let index = 0;
    setInterval(() => {
      index = (index + 1) % this.greetings.length;
      this.greetingMessage.set(this.greetings[index]);
      this.subMessage.set(this.subMessages[index]);
    }, 6000);
  }

  onAvatarClick(): void {
    this.showTooltip.update(v => !v);
  }
}
