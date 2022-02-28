const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass')(require('sass'));
const sassglob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imagecomp = require('gulp-imagemin');
const del = require('del');

function browsersync() {
  browserSync.init({
    // Инициализация Browsersync
    server: { baseDir: 'dist/' }, // Указываем папку сервера
    notify: false, // Отключаем уведомления в браузере (они бесят и никакой полезной инфы не несут)
    online: true, // Онлайн режим, если нет интернета, ставим false
  });
}

function scripts() {
  return src(['src/script.js']) // Собираем все файлы JS
    .pipe(
      babel({
        presets: ['@babel/preset-env'], // Компилятор, преобразует код из синтаксиса новых версий ES в старые, чем обеспечивает совместимость со старыми браузерами
      })
    )
    .pipe(uglify()) // Сжимаем JS
    .pipe(dest('dist/')) // Выгружаем
    .pipe(browserSync.stream()); // Триггерим Browsersync шоб он обновил страницу в браузере
}

// Стили
function styles() {
  return src('src/style.sass') // Выбираем источник
    .pipe(sassglob()) // Подрубаем плагин для подключения сразу кучи файлов (поддержка путей вида /papka/**/*)
    .pipe(sass({ 'include css': true })) // Подрубаем препроцессор
    .pipe(autoprefixer()) // Создадим префиксы с помощью Autoprefixer
    .pipe(
      // Минифицируем стили
      cleancss({
        level: { 1: { specialComments: 0 } } /* , format: 'beautify' */,
      })
    )
    .pipe(dest('dist/')) // Выгрузим результат в папку "dist"
    .pipe(browserSync.stream()); // Сделаем инъекцию в браузер
}

async function images() {
  return src('src/img/*.{jpg,jpeg,png,svg,gif}') // Берём все изображения из папки источника
    .pipe(
      imagecomp([
        imagecomp.gifsicle({ interlaced: true }),
        imagecomp.mozjpeg({ quality: 75, progressive: true }),
        imagecomp.optipng({ optimizationLevel: 5 }),
        imagecomp.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest('dist/img/')); // Выгружаем оптимизированные изображения в папку назначения
}

async function copywebp() {
  return src('src/img/**/*.webp').pipe(dest('dist/img/'));
}

async function copyhtml() {
  return src('src/**/*.html').pipe(dest('dist/'));
}

async function copyfonts() {
  return src('src/fonts/**/*').pipe(dest('dist/fonts/'));
}

function cleandist() {
  return del('dist/**/*', { force: true }); // Удаляем все содержимое папки "dist"
}

function startwatch() {
  watch('src/**/*.js', scripts);
  watch('src/**/*.sass', styles);
  watch('src/fonts/**/*', copyfonts);
  watch('src/img/**/*.{jpg,jpeg,png,svg,gif}', images);
  watch('src/img/**/*.webp', copywebp);
  // watch('src/**/*.{jpg,jpeg,png,svg,gif}', dataimg);
  watch('src/**/*.html', copyhtml).on(
    'change',
    series(copyhtml, browserSync.reload)
  );
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.copywebp = copywebp;
exports.copyfonts = copyfonts;
exports.copyhtml = copyhtml;
exports.cleandist = cleandist;

exports.default = parallel(
  copyhtml,
  copyfonts,
  images,
  copywebp,
  styles,
  scripts,
  browsersync,
  startwatch
);

exports.build = series(
  cleandist,
  copyhtml,
  copyfonts,
  images,
  copywebp,
  styles,
  scripts,
  browsersync,
  startwatch
);