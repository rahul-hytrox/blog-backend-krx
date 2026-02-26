import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { CommentService } from '../../services/comment.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    stats = {
        totalBlogs: 0,
        pendingComments: 0,
        totalComments: 0,
        totalVisitors: 0
    };

    constructor(
        private blogService: BlogService,
        private commentService: CommentService
    ) { }

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats() {
        this.blogService.getAllBlogs().subscribe({
            next: (blogs) => {
                this.stats.totalBlogs = blogs.length;
            },
            error: (err) => console.error('Error loading blogs', err)
        });

        this.commentService.getAllComments().subscribe({
            next: (comments) => {
                this.stats.totalComments = comments.length;
                this.stats.pendingComments = comments.filter(c => c.status === 'pending').length;
            },
            error: (err) => console.error('Error loading comments', err)
        });
        this.blogService.getVisitorCount().subscribe({
            next: (res) => {
                this.stats.totalVisitors = res.count;
            },
            error: (err) => console.error('Error loading visitors', err)
        });
    }
}
