import { Component, OnInit, signal, computed, inject } from '@angular/core';
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
  protected readonly activeTab = signal<'feed' | 'post' | 'admin'>('feed');
  protected readonly jobs = signal<Job[]>([]);
  protected readonly isLoadingJobs = signal(false);
  protected readonly isPostingJob = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');
  protected readonly isDarkMode = signal(false);

  // Administrative / Moderation signals
  protected readonly isAdminAuthenticated = signal(false);
  protected readonly adminPasswordInput = signal('');
  protected readonly adminError = signal('');
  protected readonly isDeletingJobId = signal<number | null>(null);

  // Form input signals
  protected readonly formTitle = signal('');
  protected readonly formDescription = signal('');
  protected readonly formSalary = signal('');
  protected readonly formWhatsapp = signal('');
  protected readonly formAddress = signal('');

  // Computeds for real-time analytics
  protected readonly totalJobs = computed(() => this.jobs().length);
  protected readonly salaryMetrics = computed(() => {
    const list = this.jobs();
    let countWithSalary = 0;
    let sumSalary = 0;
    list.forEach(j => {
      if (j.salary) {
        // Extract numbers from salary string
        const cleanStr = j.salary.replace(/[^\d.,]/g, '').replace(',', '.');
        const val = parseFloat(cleanStr);
        if (!isNaN(val) && val > 0) {
          countWithSalary++;
          sumSalary += val;
        }
      }
    });
    const avg = countWithSalary > 0 ? sumSalary / countWithSalary : 0;
    const percent = list.length > 0 ? (countWithSalary / list.length) * 100 : 0;
    return {
      avgSalary: avg,
      countWithSalary,
      percentWithSalary: percent
    };
  });

  ngOnInit() {
    this.loadJobs();
    this.checkAdminSession();
    
    // Theme detection
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkMode.set(false);
      document.documentElement.classList.remove('dark');
    }
  }

  // Toggle Dark/Light Mode
  toggleTheme() {
    const next = !this.isDarkMode();
    this.isDarkMode.set(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
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
      whatsapp: this.formWhatsapp(),
      address: this.formAddress().trim() || undefined
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
        this.formAddress.set('');

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
  setTab(tab: 'feed' | 'post' | 'admin') {
    this.activeTab.set(tab);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.adminError.set('');
    if (tab === 'feed' || tab === 'admin') {
      this.loadJobs();
    }
  }

  // Administrative / Moderation functions
  checkAdminSession() {
    const session = sessionStorage.getItem('adminSession');
    if (session === 'true') {
      this.isAdminAuthenticated.set(true);
    }
  }

  loginAdmin() {
    this.adminError.set('');
    if (this.adminPasswordInput() === 'paranoa2026') {
      this.isAdminAuthenticated.set(true);
      sessionStorage.setItem('adminSession', 'true');
      this.adminPasswordInput.set('');
    } else {
      this.adminError.set('Senha incorreta. Tente novamente.');
    }
  }

  logoutAdmin() {
    this.isAdminAuthenticated.set(false);
    this.adminPasswordInput.set('');
    this.adminError.set('');
    sessionStorage.removeItem('adminSession');
    this.activeTab.set('feed');
  }

  deleteJob(id: number | undefined) {
    if (id === undefined) return;
    if (!confirm('Tem certeza de que deseja excluir esta vaga permanentemente?')) {
      return;
    }

    this.isDeletingJobId.set(id);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.jobService.deleteJob(id).subscribe({
      next: () => {
        // Remove locally
        this.jobs.update(current => current.filter(j => j.id !== id));
        this.successMessage.set('Vaga excluída com sucesso!');
        this.isDeletingJobId.set(null);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        console.error('Error deleting job:', err);
        this.errorMessage.set('Não foi possível excluir a vaga. Verifique a conexão com o servidor.');
        this.isDeletingJobId.set(null);
        setTimeout(() => this.errorMessage.set(''), 4000);
      }
    });
  }
}
