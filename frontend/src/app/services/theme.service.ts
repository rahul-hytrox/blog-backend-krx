import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private theme = signal<'light' | 'dark'>('dark');

    constructor() {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme('dark');
        }
    }

    get currentTheme() {
        return this.theme();
    }

    toggleTheme() {
        const newTheme = this.theme() === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    private setTheme(theme: 'light' | 'dark') {
        this.theme.set(theme);
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }
}
