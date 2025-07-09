import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Character } from '../models/character';
import { tap } from 'rxjs/operators';

// GUÍA PARA EL ESTUDIANTE:
@Injectable({
  providedIn: 'root'
})
export class Api {
  // 1. URL BASE DE LA API
  // Define aquí la URL principal para el recurso "character" de la API.
  // Visita https://rickandmortyapi.com/documentation/#get-all-characters.
  private readonly API_URL = 'https://rickandmortyapi.com/api/character'; // <- ¡EL ENLACE AQUÍ!

  // 2. INYECCIÓN DE DEPENDENCIAS MODERNA
  // Usa la función `inject()` para obtener una instancia de HttpClient.
  // Esta es la práctica recomendada en Angular desde la v14.
  // ¡TU CÓDIGO AQUÍ!
  private readonly http = inject(HttpClient);
  // Pista: private readonly http = inject(HttpClient);

  // 3. GESTIÓN DE ESTADO CON SEÑALES (SIGNALS)
  // Las señales son la nueva forma de manejar estado en Angular (v16+).
  
  // a) Crea una señal privada que almacenará el arreglo de personajes.
  //    Debe ser de tipo `Character[]` y empezar como un arreglo vacío.
  private charactersSignal = signal<Character[]>([]);

  // b) Expón una versión pública de solo lectura (`asReadonly()`) de la señal.
  //    Esto permite que los componentes lean el estado, pero no lo modifiquen directamente.
  public readonly characters = this.charactersSignal.asReadonly();

  // 4. MÉTODO PARA OBTENER TODOS LOS PERSONAJES
  getCharacters(): Observable<ApiResponse> {
    // a) Usa `this.http.get<ApiResponse>()` para hacer una petición a la API_URL.
    // b) Encadena operadores de RxJS usando el método `.pipe()`.
    // c) Dentro de `pipe()`, usa el operador `tap()` para un "efecto secundario":
    //    actualiza tu señal (`charactersSignal`) con los resultados de la API.
    //    Los personajes están en `response.results`.
    
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      tap(response => {
        this.charactersSignal.set(response.results); 
      })
    );
  }

  // 5. MÉTODO PARA BUSCAR PERSONAJES POR NOMBRE
  searchCharacters(name: string): Observable<ApiResponse> {
    // a) Maneja el caso de una búsqueda vacía: si el `name` está vacío o solo
    //    contiene espacios, llama a `getCharacters()` para mostrar la lista completa y termina la ejecución.
    // b) Construye la URL de búsqueda. La API filtra por nombre con `?name=valor`.
    // c) Al igual que en `getCharacters`, usa `http.get().pipe(tap(...))`
    //    para hacer la petición y actualizar la señal con los nuevos resultados.

    if (!name.trim()) {
      return this.getCharacters();
    }
    const searchUrl = `${this.API_URL}/?name=${encodeURIComponent(name)}`;
    return this.http.get<ApiResponse>(searchUrl).pipe(
      tap(response => {
        this.charactersSignal.set(response.results);
      })
    );
    }
}

// NOTAS PEDAGÓGICAS RELEVANTES:
/*
1.  `inject()` vs. CONSTRUCTOR:
    - `inject()`: Es la forma moderna y preferida desde Angular 14. Permite inyectar dependencias sin un constructor, resultando en un código más limpio.

2.  SEÑALES (SIGNALS) vs. BEHAVIORSUBJECT:
    - `signal`: Introducido en Angular 16, es la nueva forma de manejar estado. Ofrece una detección de cambios más eficiente. Para un estado simple como una lista, es la mejor práctica actual.

3.  OPERADOR `tap()` (RxJS):
    - Permite ejecutar "efectos secundarios" (como actualizar una señal) sin modificar los datos que fluyen a través del observable. Es perfecto para actualizar nuestro `charactersSignal`.

4.  MANEJO DE ERRORES:
    - En una aplicación real, usarías el operador `catchError` de RxJS para interceptar errores de la API y evitar que la aplicación se rompa.
*/
