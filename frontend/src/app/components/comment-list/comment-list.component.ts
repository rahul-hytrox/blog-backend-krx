import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../services/comment.service';

@Component({
    selector: 'app-comment-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
    comments: any[] = [];
    loading = true;

    constructor(private commentService: CommentService) { }

    ngOnInit(): void {
        this.loadComments();
    }

    loadComments() {
        this.loading = true;
        this.commentService.getAllComments().subscribe({
            next: (data) => {
                this.comments = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading comments', err);
                this.loading = false;
            }
        });
    }

    updateStatus(id: number, status: string) {
        this.commentService.updateCommentStatus(id, status).subscribe({
            next: () => {
                this.loadComments();
            },
            error: (err) => console.error('Error updating comment status', err)
        });
    }

    deleteComment(id: number) {
        if (confirm('Are you sure you want to delete this comment?')) {
            this.commentService.deleteComment(id).subscribe({
                next: () => {
                    this.loadComments();
                },
                error: (err) => console.error('Error deleting comment', err)
            });
        }
    }
}
