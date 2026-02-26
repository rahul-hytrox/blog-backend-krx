import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-users.component.html',
    styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
    users: any[] = [];
    apiUrl = `${environment.apiUrl}/admin`;
    newUser = { username: '', password: '' };
    loading = false;
    showForm = false;

    constructor(private http: HttpClient, private authService: AuthService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    private getHeaders() {
        return new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });
    }

    loadUsers() {
        this.http.get<any[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() }).subscribe({
            next: (data) => {
                this.users = data;
            },
            error: (err) => {
                console.error('Error loading users', err);
            }
        });
    }

    createUser() {
        if (!this.newUser.username || !this.newUser.password) return;
        this.loading = true;
        this.http.post(`${this.apiUrl}/register`, this.newUser, { headers: this.getHeaders() }).subscribe({
            next: () => {
                this.loading = false;
                this.showForm = false;
                this.newUser = { username: '', password: '' };
                this.loadUsers();
            },
            error: (err) => {
                this.loading = false;
                console.error('Error creating user', err);
            }
        });
    }

    deleteUser(id: number) {
        if (confirm('Are you sure you want to delete this admin?')) {
            this.http.delete(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() }).subscribe({
                next: () => {
                    this.loadUsers();
                },
                error: (err) => {
                    console.error('Error deleting user', err);
                }
            });
        }
    }
}
