/** @type {import('stylelint').Config} */
export default {
  // Наследование готовых наборов правил
  extends: [
    'stylelint-config-standard-scss', // Стандартные правила для SCSS (уже включает postcss-scss)
    'stylelint-config-recess-order', // Сортировка свойств (по методологии Recess/Bootstrap)
  ],

  // Пользовательские исключения и настройки правил
  rules: {
    // Селектор BEM: поддерживает стандартный BEM (block__elem--mod), а также утилиты .is-*, .js-*, .no-*
    'selector-class-pattern': [
      '^(^[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$)|(^(is|js|no)-[a-z0-9]+(-[a-z0-9]+)*$)',
      {
        severity: 'error',
        message:
          'Класс должен соответствовать BEM (block__elem--mod) или быть системным флагом (.is-active, .js-click)',
      },
    ],

    // Отключаем требование о порядке специфичности для удобства вложенности в BEM
    'no-descending-specificity': null,

    // Разрешаем пустые блоки правил (например, для заготовок классов)
    'block-no-empty': null,

    // Разрешаем склеивание BEM-классов через амперсанд (&__element)
    'scss/selector-no-union-class-name': null,

    // Ограничиваем максимальный уровень вложенности в SCSS
    'max-nesting-depth': [
      4,
      {
        ignore: ['blockless-at-rules', 'pseudo-classes'],
      },
    ],

    // Разрешаем дубли с вендорными префиксами (-webkit-)
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-syntaxes'],
      },
    ],

    // Разрешаем :global (полезно в CSS Modules для стилизации сторонних библиотек)
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
  },

  // Исключаемые папки
  ignoreFiles: ['node_modules/**/*', 'dist/**/*'],
}
