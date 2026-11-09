import { FinancialScenario } from '../core/types';

export const SOFTWARE_FINANCIAL_SCENARIOS: FinancialScenario[] = [
  {
    id: 'ideal',
    name: 'Escenario 1: Asignación Ideal y Equilibrada',
    tagline: 'Operación financiera estable con alta liquidez y bajo riesgo',
    description:
      'Planificación presupuestaria trimestral para un ecosistema de desarrollo de software empresarial en crecimiento sostenido. Existe equilibrio entre arquitectura base, desarrollo de módulos de IA, control de calidad y despliegue de interfaces.',
    financialContext:
      'Presupuestos asignados en miles de USD para proyectos con retorno predecible. Los costos de interacción interdepartamental son bajos y moderados. Los rendimientos decrecientes y la fricción financiera son simétricos y homogéneos entre unidades.',
    mathematicalRationale:
      'La matriz A es estrictamente diagonal dominante con valores propios compactos y simetría exacta (A = A^T). Posee un número de condición muy bajo (κ(A) ≈ 3.4), lo que garantiza estabilidad numérica y convergencia exponencial inmediata tanto para GC como para GCP.',
    variableNames: [
      'x₁: Infraestructura Cloud & DevOps ($k USD)',
      'x₂: Innovación IA & Modelos MLOps ($k USD)',
      'x₃: Ciberseguridad & QA Automatizado ($k USD)',
      'x₄: Frontend & Experiencia Web/Móvil ($k USD)',
    ],
    variableDescriptions: [
      'Costos de aprovisionamiento en AWS/GCP, Kubernetes, pipelines CI/CD y observabilidad.',
      'Inversión en inferencia de modelos fundacionales, fine-tuning y almacenamiento vectorial.',
      'Auditorías de código estático (SAST), pentesting y frameworks de testing continuo.',
      'Diseño UX, maquetación de microfrontends, testing cross-platform y accesibilidad.',
    ],
    A: [
      [14.0,  3.0,  2.0,  1.0],
      [ 3.0, 16.0,  3.0,  2.0],
      [ 2.0,  3.0, 12.0,  2.0],
      [ 1.0,  2.0,  2.0, 10.0],
    ],
    b: [180.0, 240.0, 130.0, 110.0],
    recommendedPreconditioner: 'jacobi',
  },
  {
    id: 'stress',
    name: 'Escenario 2: Perturbación Bajo Estrés Financiero',
    tagline: 'Presión inflacionaria en costos cloud y recorte de financiamiento',
    description:
      'Escenario de contingencia tecnológica donde los costos de cómputo en la nube e infraestructura de IA sufren un incremento imprevisto (+35% de inflación de licencias y GPU clusters), mientras la dirección financiera recorta el 25% del capital disponible.',
    financialContext:
      'Las unidades deben reajustar sus prioridades operativas para mantener los servicios críticos en producción. La fricción financiera cruzada aumenta (mayor competencia entre IA y Cloud por el presupuesto restante), alterando los coeficientes fuera de la diagonal y comprimiendo el vector de metas b.',
    mathematicalRationale:
      'Se perturba de forma fundamentada el vector b (reduciendo las demandas netas) y se incrementan los coeficientes a_11 y a_22 junto con sus acoplamientos a_12. La matriz sigue siendo simétrica y definida positiva (κ(A) ≈ 8.7), desplazando el punto de equilibrio hacia una solución más austera sin perder estabilidad algorítmica.',
    variableNames: [
      'x₁: Infraestructura Cloud & DevOps ($k USD)',
      'x₂: Innovación IA & Modelos MLOps ($k USD)',
      'x₃: Ciberseguridad & QA Automatizado ($k USD)',
      'x₄: Frontend & Experiencia Web/Móvil ($k USD)',
    ],
    variableDescriptions: [
      'Inversión obligatoria para evitar degradación de SLAs y caídas de servicio ante alta demanda.',
      'Ajuste en experimentos de entrenamiento hacia modelos cuantizados y optimización de tokens.',
      'Presupuesto enfocado en seguridad de perímetro crítico y prevención de fugas de datos.',
      'Mantenimiento correctivo de apps móviles y congelamiento temporal de rediseños cosméticos.',
    ],
    A: [
      [28.0,  7.0,  4.0,  2.0],
      [ 7.0, 24.0,  5.0,  3.0],
      [ 4.0,  5.0, 15.0,  3.0],
      [ 2.0,  3.0,  3.0, 11.0],
    ],
    b: [120.0, 140.0,  85.0,  65.0],
    recommendedPreconditioner: 'jacobi',
  },
  {
    id: 'ill_conditioned',
    name: 'Escenario 3: Sistema Mal Condicionado',
    tagline: 'Disparidad extrema de escalas financieras y alto acoplamiento cruzado',
    description:
      'Inversión desbalanceada a gran escala: adquisición de infraestructura propia de supercómputo y clusters de GPUs (órdenes de magnitud millonarias) coexistiendo con presupuestos menores para utilitarios y soporte de microservicios frontend.',
    financialContext:
      'Disparidad masiva de escala de inversión entre componentes pesados de hardware/IA (x₁, x₂) frente a componentes de soporte ligero (x₃, x₄). La escala diagonal difiere en más de 2 órdenes de magnitud (1200 vs 5), provocando un condicionamiento numérico severo en métodos iterativos sin escalar.',
    mathematicalRationale:
      'La matriz A es estrictamente simétrica y definida positiva (todos sus menores principales y autovalores son > 0), pero su número de condición se dispara a κ(A) > 1,100 debido a la enorme dispersión de autovalores (λ_max / λ_min ≫ 1). El método de Gradientes Conjugados simple pierde velocidad de convergencia y precisión, mientras que el Precondicionador de Jacobi (Suñagua 2020) renormaliza el espectro y reduce κ(M⁻¹A) drásticamente a un rango inferior a 3.5, restaurando la convergencia óptima.',
    variableNames: [
      'x₁: Cluster GPU & Aceleradores de IA ($k USD)',
      'x₂: Contratos Multianuales de LLMs Fundacionales ($k USD)',
      'x₃: Testing de Regresión & Herramientas QA ($k USD)',
      'x₄: Microinteracciones & Componentes UI ($k USD)',
    ],
    variableDescriptions: [
      'Inversión de capital intensiva en clusters H100/A100 e interconexión InfiniBand de ultra baja latencia.',
      'Acuerdos corporativos de API de gran volumen con cláusulas de consumo mínimo garantizado.',
      'Suscripciones mensuales a herramientas SaaS de pruebas automatizadas y Cypress/Playwright suites.',
      'Componentes atómicos de interfaz, diseño de iconos y ajustes CSS de microinteracción.',
    ],
    A: [
      [1250.0,  350.0,   12.0,    6.0],
      [ 350.0,  950.0,    8.0,    5.0],
      [  12.0,    8.0,    8.5,    3.2],
      [   6.0,    5.0,    3.2,    4.8],
    ],
    b: [3400.0, 2600.0,   32.0,   18.0],
    recommendedPreconditioner: 'jacobi',
  },
];
