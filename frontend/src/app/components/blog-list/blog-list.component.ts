import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-blog-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
    blogs: any[] = [];
    loading = true;
    imageBaseUrl = environment.imageBaseUrl;

    constructor(private blogService: BlogService) { }

    ngOnInit(): void {
        this.loadBlogs();
    }

    loadBlogs() {
        this.loading = true;
        this.blogService.getAllBlogs().subscribe({
            next: (data) => {
                this.blogs = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading blogs', err);
                this.loading = false;
            }
        });
    }

    deleteBlog(id: number) {
        if (confirm('Are you sure you want to delete this blog?')) {
            this.blogService.deleteBlog(id).subscribe({
                next: () => {
                    this.loadBlogs();
                },
                error: (err) => console.error('Error deleting blog', err)
            });
        }
    }
}
