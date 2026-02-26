import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private apiUrl = `${environment.apiUrl}/comments`;

    constructor(private http: HttpClient) { }

    getAllComments(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    updateCommentStatus(id: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/status`, { status });
    }

    deleteComment(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
