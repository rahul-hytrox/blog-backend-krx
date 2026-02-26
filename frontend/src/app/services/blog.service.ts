import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    private apiUrl = `${environment.apiUrl}/blogs`;

    constructor(private http: HttpClient) { }

    getAllBlogs(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getBlogById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createBlog(formData: FormData): Observable<any> {
        return this.http.post(this.apiUrl, formData);
    }

    updateBlog(id: number, formData: FormData): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, formData);
    }

    deleteBlog(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    getVisitorCount(): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(`${environment.apiUrl}/visitors/count`);
    }
}
