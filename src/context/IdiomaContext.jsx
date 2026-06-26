/* ============================================================
   DrivePrep+ — IdiomaContext
   Internacionalización ES / EN.
   Provee el hook useIdioma() con t(clave) para traducir.
   ============================================================ */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { leerJSON, guardarJSON } from '../utils/storageUsuario';

/* Clave propia para idioma (antes compartía 'driveprep_ajustes' con
   TemaContext, lo que causaba que uno sobreescribiera al otro).
   Ahora además queda aislada por usuario. */
const KEY = 'driveprep_ajustes_idioma';

function leerIdiomaGuardado(userId) {
  const data = leerJSON(KEY, userId, {});
  return data.idioma || 'es';
}

/* ── Diccionario completo ── */
const TRADUCCIONES = {
  es: {
    /* ── Navegación ── */
    nav_inicio:           'Inicio',
    nav_simuladores:      'Simuladores',
    nav_practica:         'Práctica por temas',
    nav_historial:        'Historial',
    nav_estadisticas:     'Estadísticas',
    nav_recomendaciones:  'Recomendaciones',
    nav_perfil:           'Mi perfil',
    nav_ajustes:          'Ajustes',
    nav_cerrar_sesion:    'Cerrar sesión',
    nav_premium:          'Cuenta Premium',

    /* ── Auth ── */
    auth_bienvenido:      '¡Bienvenido a DrivePrep+!',
    auth_subtitulo:       'Inicia sesión para continuar con tu preparación.',
    auth_email:           'Correo electrónico',
    auth_contrasena:      'Contraseña',
    auth_recordarme:      'Recordarme',
    auth_olvide:          '¿Olvidaste tu contraseña?',
    auth_iniciar:         'Iniciar sesión',
    auth_iniciando:       'Iniciando sesión...',
    auth_no_cuenta:       '¿No tienes cuenta?',
    auth_registrate:      'Regístrate aquí',
    auth_ya_cuenta:       '¿Ya tienes cuenta?',
    auth_inicia:          'Inicia sesión',
    auth_crear:           'Crear cuenta',
    auth_creando:         'Creando cuenta...',
    auth_nombre:          'Nombre completo',
    auth_confirmar:       'Confirmar contraseña',
    auth_registro_ok:     'Cuenta creada exitosamente.',

    /* ── Dashboard ── */
    dash_saludo_manana:   'Buenos días',
    dash_saludo_tarde:    'Buenas tardes',
    dash_saludo_noche:    'Buenas noches',
    dash_subtitulo:       'Continúa con tu preparación para el examen MTC.',
    dash_progreso:        'Tu progreso',
    dash_ver_stats:       'Ver estadísticas completas →',
    dash_evolucion:       'Evolución de tus puntajes',
    dash_categorias:      'Categorías con más errores',
    dash_ver_todas:       'Ver todas →',
    dash_recomendacion:   'Recomendación para ti',
    dash_reforzar:        'Necesitas reforzar:',
    dash_practicar:       'Practicar ahora →',
    dash_ultimo_sim:      'Último simulacro',
    dash_acceso_rapido:   'Acceso rápido',
    dash_sim_realizados:  'Simulacros realizados',
    dash_promedio:        'Promedio de puntaje',
    dash_mejor_puntaje:   'Mejor puntaje obtenido',
    dash_primer_sim:      'Realiza tu primer simulacro para recibir recomendaciones personalizadas.',
    dash_sin_sim:         'Tu resultado de simulacro más reciente aparecerá aquí.',
    dash_ver_resultado:   'Ver resultado completo',
    dash_sin_evolucion:   'Aún no tienes simulacros registrados. ¡Comienza tu primer simulacro!',
    dash_sin_categorias:  'Aquí verás tus categorías con más errores una vez que realices simulacros.',
    dash_rendimiento:     'Rendimiento',

    /* ── Premium ── */
    prem_titulo:          'Actualiza a Premium',
    prem_subtitulo:       'Desbloquea todo el potencial de DrivePrep+',
    prem_mensual:         'Mensual',
    prem_trimestral:      'Trimestral',
    prem_anual:           'Anual',
    prem_popular:         'Más popular',
    prem_elegir:          'Elegir plan',
    prem_beneficios:      'Todo lo incluido en Premium:',
    prem_b1:              'Simulacros ilimitados',
    prem_b2:              'Prácticas por tema ilimitadas',
    prem_b3:              'Estadísticas avanzadas',
    prem_b4:              'Recomendaciones con IA',
    prem_b5:              'Sin anuncios',
    prem_b6:              'Soporte prioritario',
    prem_limite_sim:      'Simulacros disponibles esta semana',
    prem_limite_prac:     'Prácticas disponibles esta semana',
    prem_limite_titulo:   'Límite semanal alcanzado',
    prem_limite_msg_sim:  'Has alcanzado el límite de 5 simulacros semanales. Actualiza a Premium para simulacros ilimitados o espera la renovación el lunes.',
    prem_limite_msg_prac: 'Has alcanzado el límite de 10 prácticas semanales. Actualiza a Premium para prácticas ilimitadas o espera la renovación el lunes.',
    prem_ver_planes:      'Ver planes Premium',
    prem_esperar:         'Esperar renovación',
    prem_modal_titulo:    'Confirmar plan',
    prem_renovacion:      'Fecha de renovación estimada:',
    prem_continuar:       'Continuar al pago',
    prem_cancelar:        'Cancelar',
    prem_demo:            'Demo académica: el sistema de pagos se implementará en la Fase 3.',
    prem_gratuito_limite: 'Plan gratuito — límite semanal',

    /* ── Premium: flujo de pago (paso 1 → 4) ── */
    prem_paso1:            'Paso 1',
    prem_paso1_titulo:     'Selección de plan',
    prem_paso2:            'Paso 2',
    prem_paso2_titulo:     'Pantalla de pago',
    prem_paso3:            'Paso 3',
    prem_paso3_titulo:     'Confirmación',
    prem_proxima_renov:    'Tu próxima renovación será el',
    prem_completa_pago:    'Completa tu pago',
    prem_metodo_pago:      'Selecciona tu método de pago',
    prem_metodo_tarjeta:   'Tarjeta',
    prem_metodo_gpay:      'Google Pay',
    prem_metodo_yape:      'Yape',
    prem_metodo_plin:      'Plin',
    prem_pago_tarjeta:     'Pago con tarjeta',
    prem_titular:          'Nombre del titular',
    prem_titular_ph:       'Ej. Juan Pérez García',
    prem_num_tarjeta:      'Número de tarjeta',
    prem_vencimiento:      'Fecha de vencimiento',
    prem_cvv:              'CVV',
    prem_resumen_compra:   'Resumen de tu compra',
    prem_total_pagar:      'Total a pagar',
    prem_confirmar_susc:   'Confirmar suscripción',
    prem_redirigiendo:     'Demo académica: el sistema de pagos se implementará en la Fase 3.',
    prem_bienvenido:       '¡Bienvenido a DrivePrep+ Premium!',
    prem_susc_activada:    'Tu suscripción ha sido activada exitosamente.',
    prem_tu_plan:          'Tu plan:',
    prem_vigente_hasta:    'Vigente hasta:',
    prem_beneficios_act:   'Beneficios activados:',
    prem_comenzar:         'Comenzar a practicar',
    prem_metodo_gpay_otro: 'Otros métodos de pago se habilitarán en la Fase 3.',
    prem_campo_obligatorio:'Completa este campo para continuar.',

    /* ── Mi suscripción (Perfil) ── */
    susc_titulo:           'Mi suscripción',
    susc_plan_actual:      'Plan actual',
    susc_fecha_inicio:     'Fecha de inicio',
    susc_fecha_renov:      'Fecha de renovación',
    susc_estado:           'Estado',
    susc_activo:           'Activo',
    susc_cancelado:        'Cancelado',
    susc_cancelar:         'Cancelar suscripción',
    susc_sin_plan:         'No tienes una suscripción Premium activa.',
    susc_ver_planes:       'Ver planes Premium',
    susc_cancelar_titulo:  '¿Cancelar suscripción?',
    susc_cancelar_msg:     'Si cancelas tu suscripción, perderás los beneficios Premium al finalizar tu periodo actual.',
    susc_mantener:         'No, mantener',
    susc_si_cancelar:      'Sí, cancelar',
    susc_cancelada_ok:     'Tu suscripción ha sido cancelada.',

    /* ── Topbar ── */
    top_sin_notifs:       'Sin notificaciones nuevas',
    top_mi_perfil:        'Mi perfil',
    top_ajustes:          'Ajustes',
    top_cerrar_sesion:    'Cerrar sesión',

    /* ── Ajustes ── */
    aj_titulo:            'Ajustes',
    aj_subtitulo:         'Personaliza tu experiencia en DrivePrep+.',
    aj_guardado:          'Guardado automáticamente',
    aj_cuenta:            'Cuenta',
    aj_cuenta_desc:       'Gestiona tu información de acceso.',
    aj_cambiar_nombre:    'Cambiar nombre',
    aj_cambiar_nombre_d:  'Actualiza el nombre asociado a tu cuenta.',
    aj_cambiar_email:     'Cambiar correo',
    aj_cambiar_email_d:   'Actualiza tu correo electrónico.',
    aj_cambiar_pass:      'Cambiar contraseña',
    aj_cambiar_pass_d:    'Asegura tu cuenta con una contraseña segura.',
    aj_cuenta_nota:       'Los cambios se guardan localmente y persisten al cerrar sesión.',

    // Modales de cuenta
    aj_modal_nombre_titulo:     'Cambiar nombre',
    aj_modal_nombre_actual:     'Nombre actual',
    aj_modal_nombre_nuevo:      'Nuevo nombre',
    aj_modal_nombre_ph:         'Ingresa tu nombre',
    aj_modal_nombre_vacio:      'El nombre no puede estar vacío.',
    aj_modal_nombre_ok:         '¡Nombre actualizado correctamente!',

    aj_modal_email_titulo:      'Cambiar correo electrónico',
    aj_modal_email_actual:      'Correo actual',
    aj_modal_email_nuevo:       'Nuevo correo',
    aj_modal_email_ph:          'nuevo@correo.com',
    aj_modal_email_pass:        'Contraseña actual',
    aj_modal_email_pass_ph:     'Tu contraseña actual',
    aj_modal_email_formato:     'El correo no tiene un formato válido.',
    aj_modal_email_registrado:  'Este correo ya está registrado por otro usuario.',
    aj_modal_email_pass_err:    'Contraseña incorrecta.',
    aj_modal_email_igual:       'El nuevo correo es igual al actual.',
    aj_modal_email_ok:          '¡Correo actualizado correctamente!',

    aj_modal_pass_titulo:       'Cambiar contraseña',
    aj_modal_pass_actual:       'Contraseña actual',
    aj_modal_pass_nueva:        'Nueva contraseña',
    aj_modal_pass_confirmar:    'Confirmar nueva contraseña',
    aj_modal_pass_actual_ph:    'Tu contraseña actual',
    aj_modal_pass_nueva_ph:     'Mínimo 6 caracteres',
    aj_modal_pass_confirmar_ph: 'Repite la nueva contraseña',
    aj_modal_pass_actual_err:   'Contraseña actual incorrecta.',
    aj_modal_pass_corta:        'La nueva contraseña debe tener al menos 6 caracteres.',
    aj_modal_pass_no_coincide:  'Las contraseñas no coinciden.',
    aj_modal_pass_social:       'Las cuentas con Google/Facebook no tienen contraseña propia.',
    aj_modal_pass_ok:           '¡Contraseña actualizada correctamente!',

    aj_modal_guardar:           'Guardar cambios',
    aj_modal_cancelar:          'Cancelar',
    aj_modal_guardando:         'Guardando…',

    aj_estudio:           'Preferencias de estudio',
    aj_estudio_desc:      'Configura cómo quieres practicar.',
    aj_num_preguntas:     'Número de preguntas por simulacro',
    aj_num_preguntas_d:   'Elige cuántas preguntas quieres en cada simulacro.',
    aj_preguntas:         'preguntas',
    aj_temporizador:      'Temporizador',
    aj_temporizador_d:    'Controla el tiempo durante tus simulacros.',
    aj_temp_on:           'Activado',
    aj_temp_off:          'Desactivado',
    aj_notifs:            'Notificaciones',
    aj_notifs_desc:       'Elige qué notificaciones quieres recibir.',
    aj_notif_diario:      'Recordatorio diario',
    aj_notif_diario_d:    'Recibe un recordatorio diario para practicar.',
    aj_notif_rend:        'Aviso cuando baje mi rendimiento',
    aj_notif_rend_d:      'Te notificaremos si detectamos una baja.',
    aj_notif_push:        'Recomendaciones personalizadas',
    aj_notif_push_d:      'Recibe recomendaciones basadas en tu rendimiento.',
    aj_notifs_nota:       'Las notificaciones push estarán disponibles en la Fase 4.',
    aj_apariencia:        'Apariencia',
    aj_apariencia_desc:   'Personaliza cómo ves la aplicación.',
    aj_tema:              'Tema',
    aj_tema_desc:         'Elige el tema que prefieras.',
    aj_tema_claro:        'Claro',
    aj_tema_oscuro:       'Oscuro',
    aj_tema_auto:         'Automático',
    aj_idioma:            'Idioma',
    aj_idioma_desc:       'Selecciona el idioma de la aplicación.',
    aj_idioma_nota:       'La aplicación se mostrará en el idioma seleccionado en todos tus dispositivos.',
    aj_footer:            'Tus ajustes se guardan automáticamente.',
    aj_footer_sub:        'Puedes cambiarlos en cualquier momento.',

    /* ── Perfil ── */
    perf_titulo:          'Mi perfil',
    perf_plan_gratuito:   'Plan gratuito',
    perf_plan_premium:    'Plan Premium ✨',
    perf_actualizar:      'Actualizar a Premium',
    perf_info:            'Información personal',
    perf_conduccion:      'Datos de conducción',
    perf_preparacion:     'Nivel de preparación',
    perf_logros:          'Mis logros',
    perf_desbloqueados:   'desbloqueados',
    perf_bloqueados:      'Por desbloquear',
    perf_resumen:         'Resumen de actividad',
    perf_nombre:          'Nombre',
    perf_email:           'Correo electrónico',
    perf_miembro_desde:   'Miembro desde',
    perf_tipo_licencia:   'Tipo de licencia',
    perf_vehiculo:        'Vehículo principal',
    perf_placeholder_lic: 'Ej: A-I, A-IIa...',
    perf_placeholder_veh: 'Ej: Auto, Moto...',

    /* ── Historial ── */
    hist_titulo:          'Historial',
    hist_subtitulo:       'Registro de todos tus simulacros y prácticas.',
    hist_todos:           'Todos',
    hist_simulacros:      'Simulacros',
    hist_practica:        'Práctica',
    hist_vacio:           'Aún no tienes sesiones registradas.',
    hist_aprobado:        'Aprobado',
    hist_desaprobado:     'Desaprobado',
    hist_correctas:       'Correctas',
    hist_incorrectas:     'Incorrectas',
    hist_total:           'Total',

    /* ── Estadísticas ── */
    est_titulo:           'Estadísticas',
    est_subtitulo:        'Análisis completo de tu rendimiento.',

    /* ── Recomendaciones ── */
    rec_titulo:           'Recomendaciones',
    rec_subtitulo:        'Sugerencias personalizadas según tu rendimiento.',

    /* ── Simulador ── */
    sim_titulo:           'Simulador completo',
    sim_iniciar:          'Iniciar simulacro',
    sim_finalizar:        'Finalizar',
    sim_anterior:         'Anterior',
    sim_siguiente:        'Siguiente',

    /* ── General ── */
    gen_cargando:         'Cargando...',
    gen_guardar:          'Guardar',
    gen_cancelar:         'Cancelar',
    gen_confirmar:        'Confirmar',
    gen_cerrar:           'Cerrar',
    gen_de:               'de',
    gen_por:              'por',
  },

  en: {
    /* ── Navigation ── */
    nav_inicio:           'Home',
    nav_simuladores:      'Simulators',
    nav_practica:         'Topic Practice',
    nav_historial:        'History',
    nav_estadisticas:     'Statistics',
    nav_recomendaciones:  'Recommendations',
    nav_perfil:           'My Profile',
    nav_ajustes:          'Settings',
    nav_cerrar_sesion:    'Sign out',
    nav_premium:          'Premium Account',

    /* ── Auth ── */
    auth_bienvenido:      'Welcome to DrivePrep+!',
    auth_subtitulo:       'Sign in to continue your preparation.',
    auth_email:           'Email address',
    auth_contrasena:      'Password',
    auth_recordarme:      'Remember me',
    auth_olvide:          'Forgot your password?',
    auth_iniciar:         'Sign in',
    auth_iniciando:       'Signing in...',
    auth_no_cuenta:       "Don't have an account?",
    auth_registrate:      'Sign up here',
    auth_ya_cuenta:       'Already have an account?',
    auth_inicia:          'Sign in',
    auth_crear:           'Create account',
    auth_creando:         'Creating account...',
    auth_nombre:          'Full name',
    auth_confirmar:       'Confirm password',
    auth_registro_ok:     'Account created successfully.',

    /* ── Dashboard ── */
    dash_saludo_manana:   'Good morning',
    dash_saludo_tarde:    'Good afternoon',
    dash_saludo_noche:    'Good evening',
    dash_subtitulo:       'Continue your MTC exam preparation.',
    dash_progreso:        'Your progress',
    dash_ver_stats:       'View full statistics →',
    dash_evolucion:       'Score evolution',
    dash_categorias:      'Categories with most errors',
    dash_ver_todas:       'View all →',
    dash_recomendacion:   'Recommendation for you',
    dash_reforzar:        'You need to reinforce:',
    dash_practicar:       'Practice now →',
    dash_ultimo_sim:      'Last simulator',
    dash_acceso_rapido:   'Quick access',
    dash_sim_realizados:  'Simulators completed',
    dash_promedio:        'Average score',
    dash_mejor_puntaje:   'Best score',
    dash_primer_sim:      'Complete your first simulator to receive personalized recommendations.',
    dash_sin_sim:         'Your most recent simulator result will appear here.',
    dash_ver_resultado:   'View full result',
    dash_sin_evolucion:   'No simulators yet. Start your first one!',
    dash_sin_categorias:  'Your weakest categories will appear here after you complete simulators.',
    dash_rendimiento:     'Performance',

    /* ── Premium ── */
    prem_titulo:          'Upgrade to Premium',
    prem_subtitulo:       'Unlock the full potential of DrivePrep+',
    prem_mensual:         'Monthly',
    prem_trimestral:      'Quarterly',
    prem_anual:           'Annual',
    prem_popular:         'Most popular',
    prem_elegir:          'Choose plan',
    prem_beneficios:      "Everything included in Premium:",
    prem_b1:              'Unlimited simulators',
    prem_b2:              'Unlimited topic practices',
    prem_b3:              'Advanced statistics',
    prem_b4:              'AI-powered recommendations',
    prem_b5:              'Ad-free',
    prem_b6:              'Priority support',
    prem_limite_sim:      'Simulators available this week',
    prem_limite_prac:     'Practices available this week',
    prem_limite_titulo:   'Weekly limit reached',
    prem_limite_msg_sim:  'You have reached the 5 weekly simulator limit. Upgrade to Premium for unlimited access or wait until Monday.',
    prem_limite_msg_prac: 'You have reached the 10 weekly practice limit. Upgrade to Premium for unlimited access or wait until Monday.',
    prem_ver_planes:      'View Premium plans',
    prem_esperar:         'Wait for renewal',
    prem_modal_titulo:    'Confirm plan',
    prem_renovacion:      'Estimated renewal date:',
    prem_continuar:       'Continue to payment',
    prem_cancelar:        'Cancel',
    prem_demo:            'Academic demo: the payment system will be implemented in Phase 3.',
    prem_gratuito_limite: 'Free plan — weekly limit',

    /* ── Premium: payment flow (step 1 → 4) ── */
    prem_paso1:            'Step 1',
    prem_paso1_titulo:     'Plan selection',
    prem_paso2:            'Step 2',
    prem_paso2_titulo:     'Payment screen',
    prem_paso3:            'Step 3',
    prem_paso3_titulo:     'Confirmation',
    prem_proxima_renov:    'Your next renewal will be on',
    prem_completa_pago:    'Complete your payment',
    prem_metodo_pago:      'Select your payment method',
    prem_metodo_tarjeta:   'Card',
    prem_metodo_gpay:      'Google Pay',
    prem_metodo_yape:      'Yape',
    prem_metodo_plin:      'Plin',
    prem_pago_tarjeta:     'Card payment',
    prem_titular:          'Cardholder name',
    prem_titular_ph:       'E.g. John Smith',
    prem_num_tarjeta:      'Card number',
    prem_vencimiento:      'Expiration date',
    prem_cvv:              'CVV',
    prem_resumen_compra:   'Order summary',
    prem_total_pagar:      'Total to pay',
    prem_confirmar_susc:   'Confirm subscription',
    prem_redirigiendo:     'Academic demo: the payment system will be implemented in Phase 3.',
    prem_bienvenido:       'Welcome to DrivePrep+ Premium!',
    prem_susc_activada:    'Your subscription has been activated successfully.',
    prem_tu_plan:          'Your plan:',
    prem_vigente_hasta:    'Valid until:',
    prem_beneficios_act:   'Active benefits:',
    prem_comenzar:         'Start practicing',
    prem_metodo_gpay_otro: 'Other payment methods will be enabled in Phase 3.',
    prem_campo_obligatorio:'Fill in this field to continue.',

    /* ── My subscription (Profile) ── */
    susc_titulo:           'My subscription',
    susc_plan_actual:      'Current plan',
    susc_fecha_inicio:     'Start date',
    susc_fecha_renov:      'Renewal date',
    susc_estado:           'Status',
    susc_activo:           'Active',
    susc_cancelado:        'Cancelled',
    susc_cancelar:         'Cancel subscription',
    susc_sin_plan:         "You don't have an active Premium subscription.",
    susc_ver_planes:       'View Premium plans',
    susc_cancelar_titulo:  'Cancel subscription?',
    susc_cancelar_msg:     "If you cancel your subscription, you'll lose Premium benefits at the end of your current period.",
    susc_mantener:         'No, keep it',
    susc_si_cancelar:      'Yes, cancel',
    susc_cancelada_ok:     'Your subscription has been cancelled.',

    /* ── Topbar ── */
    top_sin_notifs:       'No new notifications',
    top_mi_perfil:        'My profile',
    top_ajustes:          'Settings',
    top_cerrar_sesion:    'Sign out',

    /* ── Settings ── */
    aj_titulo:            'Settings',
    aj_subtitulo:         'Customize your DrivePrep+ experience.',
    aj_guardado:          'Saved automatically',
    aj_cuenta:            'Account',
    aj_cuenta_desc:       'Manage your account information.',
    aj_cambiar_nombre:    'Change name',
    aj_cambiar_nombre_d:  'Update the name on your account.',
    aj_cambiar_email:     'Change email',
    aj_cambiar_email_d:   'Update your email address.',
    aj_cambiar_pass:      'Change password',
    aj_cambiar_pass_d:    'Keep your account secure.',
    aj_cuenta_nota:       'Changes are saved locally and persist after logging out.',

    // Account modals
    aj_modal_nombre_titulo:     'Change name',
    aj_modal_nombre_actual:     'Current name',
    aj_modal_nombre_nuevo:      'New name',
    aj_modal_nombre_ph:         'Enter your name',
    aj_modal_nombre_vacio:      'Name cannot be empty.',
    aj_modal_nombre_ok:         'Name updated successfully!',

    aj_modal_email_titulo:      'Change email address',
    aj_modal_email_actual:      'Current email',
    aj_modal_email_nuevo:       'New email',
    aj_modal_email_ph:          'new@email.com',
    aj_modal_email_pass:        'Current password',
    aj_modal_email_pass_ph:     'Your current password',
    aj_modal_email_formato:     'Invalid email format.',
    aj_modal_email_registrado:  'This email is already registered by another user.',
    aj_modal_email_pass_err:    'Incorrect password.',
    aj_modal_email_igual:       'The new email is the same as the current one.',
    aj_modal_email_ok:          'Email updated successfully!',

    aj_modal_pass_titulo:       'Change password',
    aj_modal_pass_actual:       'Current password',
    aj_modal_pass_nueva:        'New password',
    aj_modal_pass_confirmar:    'Confirm new password',
    aj_modal_pass_actual_ph:    'Your current password',
    aj_modal_pass_nueva_ph:     'Minimum 6 characters',
    aj_modal_pass_confirmar_ph: 'Repeat your new password',
    aj_modal_pass_actual_err:   'Incorrect current password.',
    aj_modal_pass_corta:        'New password must be at least 6 characters.',
    aj_modal_pass_no_coincide:  'Passwords do not match.',
    aj_modal_pass_social:       'Google/Facebook accounts do not have their own password.',
    aj_modal_pass_ok:           'Password updated successfully!',

    aj_modal_guardar:           'Save changes',
    aj_modal_cancelar:          'Cancel',
    aj_modal_guardando:         'Saving…',

    aj_estudio:           'Study preferences',
    aj_estudio_desc:      'Configure how you want to practice.',
    aj_num_preguntas:     'Number of questions per simulator',
    aj_num_preguntas_d:   'Choose how many questions per simulator.',
    aj_preguntas:         'questions',
    aj_temporizador:      'Timer',
    aj_temporizador_d:    'Control time during your simulators.',
    aj_temp_on:           'Enabled',
    aj_temp_off:          'Disabled',
    aj_notifs:            'Notifications',
    aj_notifs_desc:       'Choose which notifications to receive.',
    aj_notif_diario:      'Daily reminder',
    aj_notif_diario_d:    'Receive a daily reminder to practice.',
    aj_notif_rend:        'Performance drop alert',
    aj_notif_rend_d:      "We'll notify you if we detect a drop.",
    aj_notif_push:        'Personalized recommendations',
    aj_notif_push_d:      'Receive recommendations based on your performance.',
    aj_notifs_nota:       'Push notifications will be available in Phase 4.',
    aj_apariencia:        'Appearance',
    aj_apariencia_desc:   'Customize how you see the app.',
    aj_tema:              'Theme',
    aj_tema_desc:         'Choose your preferred theme.',
    aj_tema_claro:        'Light',
    aj_tema_oscuro:       'Dark',
    aj_tema_auto:         'Auto',
    aj_idioma:            'Language',
    aj_idioma_desc:       'Select the app language.',
    aj_idioma_nota:       'The app will display in the selected language on all your devices.',
    aj_footer:            'Your settings are saved automatically.',
    aj_footer_sub:        'You can change them at any time.',

    /* ── Profile ── */
    perf_titulo:          'My Profile',
    perf_plan_gratuito:   'Free plan',
    perf_plan_premium:    'Premium Plan ✨',
    perf_actualizar:      'Upgrade to Premium',
    perf_info:            'Personal information',
    perf_conduccion:      'Driving data',
    perf_preparacion:     'Preparation level',
    perf_logros:          'My achievements',
    perf_desbloqueados:   'unlocked',
    perf_bloqueados:      'Yet to unlock',
    perf_resumen:         'Activity summary',
    perf_nombre:          'Name',
    perf_email:           'Email',
    perf_miembro_desde:   'Member since',
    perf_tipo_licencia:   'License type',
    perf_vehiculo:        'Main vehicle',
    perf_placeholder_lic: 'E.g.: A-I, A-IIa...',
    perf_placeholder_veh: 'E.g.: Car, Motorcycle...',

    /* ── History ── */
    hist_titulo:          'History',
    hist_subtitulo:       'Record of all your simulators and practices.',
    hist_todos:           'All',
    hist_simulacros:      'Simulators',
    hist_practica:        'Practice',
    hist_vacio:           'No sessions recorded yet.',
    hist_aprobado:        'Passed',
    hist_desaprobado:     'Failed',
    hist_correctas:       'Correct',
    hist_incorrectas:     'Incorrect',
    hist_total:           'Total',

    /* ── Statistics ── */
    est_titulo:           'Statistics',
    est_subtitulo:        'Complete analysis of your performance.',

    /* ── Recommendations ── */
    rec_titulo:           'Recommendations',
    rec_subtitulo:        'Personalized suggestions based on your performance.',

    /* ── Simulator ── */
    sim_titulo:           'Full simulator',
    sim_iniciar:          'Start simulator',
    sim_finalizar:        'Finish',
    sim_anterior:         'Previous',
    sim_siguiente:        'Next',

    /* ── General ── */
    gen_cargando:         'Loading...',
    gen_guardar:          'Save',
    gen_cancelar:         'Cancel',
    gen_confirmar:        'Confirm',
    gen_cerrar:           'Close',
    gen_de:               'of',
    gen_por:              'by',
  },
};

const IdiomaContext = createContext(null);

export function IdiomaProvider({ children }) {
  const { usuario } = useAuth();
  const userId = usuario?.id || null;

  const [idioma, setIdioma] = useState(() => leerIdiomaGuardado(userId));

  /* Al cambiar de cuenta, cargar el idioma guardado de la cuenta
     nueva en vez de seguir mostrando el de la sesión anterior.
     Si es una cuenta nueva sin preferencia guardada, queda 'es'
     tal como pide la consigna ("Idioma: español" por defecto). */
  useEffect(() => {
    setIdioma(leerIdiomaGuardado(userId));
  }, [userId]);

  const cambiarIdioma = useCallback((nuevoIdioma) => {
    setIdioma(nuevoIdioma);
    const datos = leerJSON(KEY, userId, {});
    guardarJSON(KEY, userId, { ...datos, idioma: nuevoIdioma });
  }, [userId]);

  const t = useCallback((clave) => {
    return TRADUCCIONES[idioma]?.[clave] ?? TRADUCCIONES['es']?.[clave] ?? clave;
  }, [idioma]);

  return (
    <IdiomaContext.Provider value={{ idioma, cambiarIdioma, t }}>
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma() {
  const ctx = useContext(IdiomaContext);
  if (!ctx) throw new Error('useIdioma debe usarse dentro de <IdiomaProvider>');
  return ctx;
}
