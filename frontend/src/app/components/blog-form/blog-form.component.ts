import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { environment } from '../../../environments/environment';
import { QuillModule } from 'ngx-quill';
import hljs from 'highlight.js';

// Necessary for Quill code highlighting
(window as any).hljs = hljs;

@Component({
    selector: 'app-blog-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, QuillModule],
    templateUrl: './blog-form.component.html',
    styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent implements OnInit {
    blog: any = {
        title: '',
        content: ''
    };
    selectedFile: File | null = null;
    editMode = false;
    id: number | null = null;
    loading = false;
    previewUrl: string | null = null;

    quillConfig = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],                                         // remove formatting button
            ['link', 'image']                                 // link and image
        ],
        syntax: true // Enable syntax highlighting
    };

    constructor(
        private blogService: BlogService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.editMode = true;
            this.id = +idParam;
            this.loadBlog(this.id);
        }
    }

    loadBlog(id: number) {
        this.blogService.getBlogById(id).subscribe({
            next: (data) => {
                this.blog = data;
                if (data.image_url) {
                    this.previewUrl = environment.imageBaseUrl + data.image_url;
                }
            },
            error: (err) => console.error('Error loading blog', err)
        });
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
        if (this.selectedFile) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.previewUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    onSubmit() {
        this.loading = true;
        const formData = new FormData();
        formData.append('title', this.blog.title);
        formData.append('content', this.blog.content);
        if (this.selectedFile) {
            formData.append('image', this.selectedFile);
        } else if (this.blog.image_url) {
            formData.append('image_url', this.blog.image_url);
        }

        if (this.editMode && this.id) {
            this.blogService.updateBlog(this.id, formData).subscribe({
                next: () => {
                    this.router.navigate(['/admin/blogs']);
                },
                error: (err) => {
                    this.loading = false;
                    console.error('Error updating blog', err);
                }
            });
        } else {
            this.blogService.createBlog(formData).subscribe({
                next: () => {
                    this.router.navigate(['/admin/blogs']);
                },
                error: (err) => {
                    this.loading = false;
                    console.error('Error creating blog', err);
                }
            });
        }
    }
}
