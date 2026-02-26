import { Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth.guard';
import { LoginComponent } from '@app/components/login/login.component';
import { DashboardComponent } from '@app/components/dashboard/dashboard.component';
import { BlogListComponent } from '@app/components/blog-list/blog-list.component';
import { BlogFormComponent } from '@app/components/blog-form/blog-form.component';
import { CommentListComponent } from '@app/components/comment-list/comment-list.component';
import { AdminUsersComponent } from '@app/components/admin-users/admin-users.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'admin',
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'blogs', component: BlogListComponent },
            { path: 'blogs/new', component: BlogFormComponent },
            { path: 'blogs/edit/:id', component: BlogFormComponent },
            { path: 'comments', component: CommentListComponent },
            { path: 'users', component: AdminUsersComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
