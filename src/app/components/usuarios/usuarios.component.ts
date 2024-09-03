import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  currentUser: any = { roles: [] };
  isAddingUser: boolean = false;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al cargar los usuarios', error);
      }
    );
  }

  startAddingUser(): void {
    this.selectedUser = null;
    this.currentUser = { roles: [] };
    this.isAddingUser = true;
  }

  editUser(user: any): void {
    this.selectedUser = { ...user };
    this.currentUser = {
      name: user.name,
      email: user.email,
      password: '',
      roles: user.roles
    };
    this.isAddingUser = false;
  }

  onSaveUser(): void {
    console.log('Guardando usuario:', this.currentUser);
    if (this.selectedUser) {
      // Editar un usuario existente
      this.userService.updateUser(this.selectedUser._id, this.currentUser).subscribe(
        (updatedUser) => {
          const index = this.users.findIndex(user => user._id === updatedUser._id);
          if (index > -1) {
            this.users[index] = updatedUser;
          }
          this.selectedUser = null;
          this.currentUser = { roles: [] };
          this.isAddingUser = false;
        },
        (error) => {
          console.error('Error al actualizar el usuario', error);
        }
      );
    } else if (this.currentUser) {
      this.userService.createUser(this.currentUser).subscribe(
        (createdUser) => {
          this.users.push(createdUser);
          this.currentUser = { roles: [] };
          this.isAddingUser = false;
        },
        (error) => {
          console.error('Error al agregar el usuario', error);
        }
      );
    }
  }

  onCancel(): void {
    this.selectedUser = null;
    this.currentUser = { roles: [] };
    this.isAddingUser = false;
  }

  deleteUser(userId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter(user => user._id !== userId);
          this.selectedUser = null;
          this.currentUser = { roles: [] };
        },
        (error) => {
          console.error('Error al eliminar el usuario', error);
        }
      );
    }
  }
}

