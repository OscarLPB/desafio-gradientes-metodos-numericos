# Simulador Financiero de I+D en Software mediante Gradientes Conjugados Precondicionado (GCP)

[![UMSA](https://img.shields.io/badge/UMSA-Informática-002B49.svg)](https://informatica.umsa.bo/)
[![Materia](https://img.shields.io/badge/INF--373-Métodos_Numéricos_I-0284c7.svg)]()
[![Algoritmo](https://img.shields.io/badge/Algoritmo-Suñagua_(2020)-10b981.svg)]()
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)]()
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)]()

> **Desafío Académico de Métodos Numéricos I (INF-373)**  
> **Universidad Mayor de San Andrés (UMSA)**  
> Facultad de Ciencias Puras y Naturales · Carrera de Informática  
> **Mención:** Desarrollo de Software e Innovación Tecnológica (Desarrollo de Sistemas)

---

## 📌 Datos Académicos

* **Estudiante:** Oscar Felipe Valencia Sanchez
* **Docente:** Lic. Brigida Carvajal Blanco
* **Materia:** Métodos Numéricos I (INF-373)
* **Entregables:**
  1. Página Web Interactiva Funcional (con los 10 módulos de la Sección 7 y la Tabla de la Sección 8 integrados).
  2. Repositorio de Código Fuente estructurado con historial de commits y documentación técnica.

---

## 🚀 Descripción del Proyecto

Aplicación web reactiva de alto rendimiento orientada a la **simulación, asignación y optimización presupuestaria de recursos en I+D de Software e Innovación Tecnológica**. Modela un sistema lineal de ecuaciones simétrico y definido positivo:

$$A x = b \quad (n = 4)$$

derivado de minimizar la función cuadrática de costos y fricción operativa interdepartamental:

$$\min_{x} f(x) = \frac{1}{2} x^T A x - b^T x$$

El sistema implementa de forma rigurosa el **Método de Gradientes Conjugados Precondicionado (GCP)** formulado por el docente e investigador **Porfirio Suñagua S. (2020)** (*Revista Boliviana de Matemática – UMSA, Vol. 04, pp. 2–7*), comparándolo frente a la **Factorización de Cholesky** ($A = L L^T$) como solución exacta de referencia y frente a **Gradientes Conjugados simple** (sin precondicionar).

---

## 📊 Variables Financieras del Modelo ($n = 4$)

* **$x_1$:** Inversión en **Infraestructura Cloud, Microservicios & DevOps** (\$k USD). Aprovisionamiento de servidores elásticos, clústeres Kubernetes, mallas Istio y CI/CD.
* **$x_2$:** Inversión en **Innovación en Inteligencia Artificial & MLOps** (\$k USD). Clústeres GPU, fine-tuning de LLMs fundacionales, embeddings y observabilidad.
* **$x_3$:** Inversión en **Ciberseguridad, QA & Automatización de Pruebas** (\$k USD). Auditorías estáticas (SAST/DAST), suites Playwright/Cypress y pruebas de estrés.
* **$x_4$:** Inversión en **Frontend, UI/UX & Plataformas Móviles** (\$k USD). Maquetación atómica, accesibilidad WCAG y optimización de Core Web Vitals.

---

## 🔬 Tres Escenarios Obligatorios

| Escenario | Contexto Financiero / Tecnológico | Propiedades Matriciales | Comportamiento del Algoritmo |
| :--- | :--- | :--- | :--- |
| **1. Ideal** | Presupuesto balanceado, liquidez y crecimiento sostenido. | $\kappa(A) \approx 3.4$ (bien condicionada), diagonal dominante. | Convergencia ultra rápida en 3-4 iteraciones ($E_p < 10^{-10}\%$). |
| **2. Bajo Estrés Financiero** | Inflación en costos cloud (+35%) y recorte de capital (-25%). | $\kappa(A) \approx 8.7$, perturbación de $b$ y coeficientes de interacción. | Reequilibrio automático de la inversión hacia áreas críticas. |
| **3. Mal Condicionado** | Disparidad masiva de escala de inversión (hardware IA vs herramientas ligeras). | $\kappa(A) > 1,100$ (espectro altamente disperso). | **Efecto Suñagua (2020):** El precondicionador diagonal colapsa $\kappa(M^{-1}A)$ a $\approx 3.2$, reduciendo el residuo de $10^{-10}$ a $10^{-16}$. |

---

## 🏗️ Arquitectura de Software (Clean & Modular Architecture)

Diseñado siguiendo las mejores prácticas de la ingeniería de software moderna:

```
src/
├── core/                        # Motor Numérico Puro (Cero dependencias UI)
│   ├── types.ts                 # Definiciones de tipos e interfaces TypeScript
│   ├── matrix.ts                # Operaciones vectoriales, Sylvester, autovalores Jacobi, κ(A)
│   ├── directSolver.ts          # Solución exacta de referencia (Factorización de Cholesky L·Lᵀ)
│   ├── solvers.ts               # Algoritmo Suñagua (2020) GCP con Jacobi/SSOR y GC simple
│   ├── errorAnalysis.ts         # Métricas de error (Ea, Er, Ep) y residuo relativo global
│   └── qaTests.ts               # Suite de 4 pruebas de software automatizadas (QA)
├── data/
│   └── scenarios.ts             # Coeficientes numéricos justificados de los 3 escenarios
├── components/                  # Componentes Reactivos UI
│   ├── Header.tsx               # Módulo 1: Portada académica y datos institucionales UMSA
│   ├── Navigation.tsx           # Barra de navegación fluida
│   ├── CaseStudy.tsx            # Módulos 2 & 3: Contexto I+D, variables y Criterio de Sylvester
│   ├── MatrixEditor.tsx         # Módulos 4 & 5: Editor matricial reactivo y selector de escenarios
│   ├── DirectSolutionView.tsx   # Módulo 6: Despliegue de Cholesky (solución exacta)
│   ├── ConvergenceView.tsx      # Módulo 7: Gráfico interactivo logarítmico GCP vs GC
│   ├── ErrorAnalysisView.tsx    # Módulo 8: Desglose de errores por variable y κ(A)
│   ├── ComparativeTable.tsx     # Sección 8: Tabla comparativa obligatoria de los 3 escenarios
│   ├── QAModuleView.tsx         # Módulo 9: Suite de pruebas QA ejecutables con 1 clic
│   └── ConclusionsView.tsx      # Módulo 10: Conclusiones técnicas, financieras y bibliografía
├── App.tsx                      # Orquestador del estado y reactividad instantánea
├── main.tsx                     # Punto de entrada de React 18
└── index.css                    # Estilos Tailwind CSS
```

---

## 🧪 Pruebas de Software Obligatorias (Módulo QA)

La aplicación incluye un módulo de control de calidad ejecutable en vivo:
1. **QA-01 (Carga de Escenarios):** Verificación de que los 3 escenarios cumplen simetría ($A = A^T$), definición positiva por menores de Sylvester ($\Delta_k > 0$) y convergencia a $\|r_k\| / \|b\| < 10^{-6}$.
2. **QA-02 (Matriz No Válida):** Inyección deliberada de matriz asimétrica y no-SPD, verificando captura de excepciones sin colapso del sistema.
3. **QA-03 (Edición Dinámica):** Medición del tiempo de recálculo en caliente (< 50 ms), garantizando respuesta a 60 fps.
4. **QA-04 (Comparativa de Precondicionamiento):** Validación empírica de reducción del número de condición de 1,170 a 3.2 y menor residuo con GCP Suñagua.

---

## 💻 Instalación y Ejecución Local

### Prerrequisitos
* Node.js v18+ (recomendado v20+)
* npm v9+

### Pasos
1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd "Metodos Numericos"
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar servidor de desarrollo local:
   ```bash
   npm run dev
   ```
   Abrir en el navegador en `http://localhost:5173`.

4. Compilar para producción:
   ```bash
   npm run build
   ```
   Los archivos estáticos optimizados se generarán en la carpeta `dist/`.

---

## 🌐 Despliegue Público (GitHub Pages)

### Despliegue en GitHub Pages:
https://oscarlpb.github.io/desafio-gradientes-metodos-numericos/

---

## 📚 Bibliografía Principal

1. **Suñagua S., P. (2020).** *Método de Gradientes Conjugados Precondicionado*. Revista Boliviana de Matemática – UMSA, 04, 2–7.
2. **Golub, G. H., & Van Loan, C. F. (2013).** *Matrix Computations* (4th ed.). Johns Hopkins University Press.
3. **Saad, Y. (2003).** *Iterative Methods for Sparse Linear Systems* (2nd ed.). SIAM.
4. **Shewchuk, J. R. (1994).** *An Introduction to the Conjugate Gradient Method Without the Agonizing Pain*. Carnegie Mellon University.
