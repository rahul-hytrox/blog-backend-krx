import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username = '';
    password = '';
    error = '';
    loading = false;

    constructor(private authService: AuthService, private router: Router) {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/admin/dashboard']);
        }
    }

    onSubmit() {
        this.loading = true;
        this.error = '';
        this.authService.login(this.username, this.password).subscribe({
            next: () => {
                this.router.navigate(['/admin/dashboard']);
            },
            error: (err) => {
                this.error = 'Invalid username or password';
                this.loading = false;
                console.error('Login error', err);
            }
        });
    }
}
