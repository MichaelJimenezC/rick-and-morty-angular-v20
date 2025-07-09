import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Character } from '../../models/character';
import { finalize } from 'rxjs/operators';

// GUÍA PARA EL ESTUDIANTE:
@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule, // Necesario para el control de flujo (@if, @for)
    FormsModule   // Necesario para el binding de formularios con [(ngModel)]
  ],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss']
})
export class CharacterListComponent implements OnInit {

  // 1. INYECCIÓN DE DEPENDENCIAS
  // Inyecta el servicio `Api` para poder hacer peticiones a la API.
  private api = inject(Api);

  // 2. GESTIÓN DE ESTADO LOCAL CON SEÑALES
  // El componente es responsable de mantener su propio estado.

  // a) Señal de personajes directamente desde el servicio `Api`.
  //    Así, el componente se convierte en un consumidor del estado centralizado.
  public characters = this.api.characters;

  // b) Propiedades para el término de búsqueda y los estados de la UI.
  public searchTerm: string = '';
  public loading = false;
  public errorMessage = '';

  // c) Señal computada para saber si hay personajes.
  //    Se basará directamente en la señal expuesta por el servicio.
  public hasCharacters = computed(() => this.characters().length > 0);

  // 3. LIFECYCLE HOOK - ngOnInit
  // Se ejecuta cuando el componente se inicia. Perfecto para cargar datos iniciales.
  ngOnInit(): void {
    // Llama al método para cargar la lista inicial de personajes.
    this.loadInitialCharacters();
  }

  // 4. MÉTODO PARA CARGAR LA LISTA INICIAL
  loadInitialCharacters(): void {
    // a) Actualiza los estados: `loading` a `true` y limpia cualquier `errorMessage`.
    // b) Llama al método `getCharacters()` del servicio `api`.
    // c) Suscríbete al Observable. El servicio ya se encarga de actualizar la señal,
    //    así que aquí solo necesitas manejar el estado de carga y los errores.
    //    - `error`: Si hay un error, asígnale un mensaje a `errorMessage`.
    //    - `finalize`: Usa el operador `finalize` dentro de `.pipe()` para poner `loading` a `false`.

    // ¡TU CÓDIGO AQUÍ!
    // a) Activar loading y limpiar errores previos
    this.loading = true;
    this.errorMessage = '';

    // b) Llamar al servicio
    this.api.getCharacters().pipe(
      // c) finalize: se ejecuta al terminar (éxito o error)
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: () => {
        // No es necesario hacer nada aquí porque el servicio actualiza la señal
      },
      error: (err) => {
        // Manejo de error: mostrar mensaje
        this.errorMessage = 'Ocurrió un error al cargar los personajes.';
        console.error('Error al obtener personajes:', err);
      }
    });
  }

  // 5. MÉTODO PARA EJECUTAR UNA BÚSQUEDA
  onSearch(): void {
    // Lógica similar a `loadInitialCharacters`:
    // a) Actualiza los estados de `loading` y `errorMessage`.
    // b) Llama al método `searchCharacters(this.searchTerm)` del servicio.
    // c) Suscríbete para manejar los estados de la UI. La señal se actualiza sola.

    // ¡TU CÓDIGO AQUÍ!
    // a) Preparar la UI
    this.loading = true;
    this.errorMessage = '';

    // b) Ejecutar la búsqueda
    this.api.searchCharacters(this.searchTerm).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: () => {
        // No necesitas hacer nada aquí; la señal se actualiza desde el servicio
      },
      error: (err) => {
        // Mostrar mensaje si hay error (por ejemplo, 404 Not Found)
        this.errorMessage = 'No se encontraron personajes con ese nombre.';
        console.error('Error en la búsqueda:', err);
      }
    });
  }

  // 6. MÉTODO AUXILIAR PARA EL INPUT
  // Se ejecuta cada vez que se presiona una tecla en el campo de búsqueda.
  onSearchKeyup(event: KeyboardEvent): void {
    // Si la tecla presionada es "Enter", ejecuta la búsqueda.
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}