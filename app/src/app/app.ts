import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from './services/job.service';
import { Job } from './models/job.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly jobService = inject(JobService);

  // State signals
  protected readonly activeTab = signal<'feed' | 'post'>('feed');
  protected readonly jobs = signal<Job[]>([]);
  protected readonly isLoadingJobs = signal(false);
  protected readonly isPostingJob = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');

  // Form input signals
  protected readonly formTitle = signal('');
  protected readonly formDescription = signal('');
  protected readonly formSalary = signal('');
  protected readonly formWhatsapp = signal('');

  ngOnInit() {
    this.loadJobs();
  }

  // Load job listings from backend API
  loadJobs() {
    this.isLoadingJobs.set(true);
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs.set(data);
        this.isLoadingJobs.set(false);
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.errorMessage.set('Não foi possível carregar as vagas. Verifique se o backend está ativo.');
        this.isLoadingJobs.set(false);
      }
    });
  }

  // Handle job posting
  submitJob() {
    // Basic validation
    if (!this.formTitle().trim() || !this.formDescription().trim() || !this.formWhatsapp().trim()) {
      this.errorMessage.set('Por favor, preencha todos os campos obrigatórios (Título, Descrição e WhatsApp).');
      return;
    }

    this.isPostingJob.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const newJob: Job = {
      title: this.formTitle(),
      description: this.formDescription(),
      salary: this.formSalary().trim() || undefined,
      whatsapp: this.formWhatsapp()
    };

    this.jobService.createJob(newJob).subscribe({
      next: (created) => {
        // Update list locally
        this.jobs.update(currentJobs => [created, ...currentJobs]);
        
        // Reset form signals
        this.formTitle.set('');
        this.formDescription.set('');
        this.formSalary.set('');
        this.formWhatsapp.set('');

        this.successMessage.set('Vaga cadastrada com sucesso!');
        this.isPostingJob.set(false);

        // Auto redirect to feed after a short delay
        setTimeout(() => {
          this.successMessage.set('');
          this.activeTab.set('feed');
        }, 1500);
      },
      error: (err) => {
        console.error('Error posting job:', err);
        this.errorMessage.set('Erro ao publicar a vaga. Verifique as validações e tente novamente.');
        this.isPostingJob.set(false);
      }
    });
  }

  // Generate cleaned-up WhatsApp Redirect URL
  getWhatsAppUrl(whatsapp: string, jobTitle: string): string {
    // Remove formatting characters
    let clean = whatsapp.replace(/\D/g, '');

    // Prepend Brazil country code if not present
    if (clean.length === 10 || clean.length === 11) {
      clean = '55' + clean;
    }

    const message = encodeURIComponent(`Olá! Vi a vaga de "${jobTitle}" no Conecta Emprego Paranoá e tenho muito interesse.`);
    return `https://wa.me/${clean}?text=${message}`;
  }

  // Helper to format WhatsApp inputs on typing
  formatPhoneNumber(val: string): string {
    const raw = val.replace(/\D/g, '');
    if (raw.length <= 2) return raw;
    if (raw.length <= 7) return `(${raw.substring(0, 2)}) ${raw.substring(2)}`;
    return `(${raw.substring(0, 2)}) ${raw.substring(2, 7)}-${raw.substring(7, 11)}`;
  }

  onWhatsappInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const formatted = this.formatPhoneNumber(input.value);
    this.formWhatsapp.set(formatted);
    input.value = formatted; // Keep cursor display in sync
  }

  // Toggle active tab
  setTab(tab: 'feed' | 'post') {
    this.activeTab.set(tab);
    this.errorMessage.set('');
    this.successMessage.set('');
    if (tab === 'feed') {
      this.loadJobs();
    }
  }
}
