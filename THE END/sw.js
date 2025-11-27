// اسم النسخة (غيّره كلما حدثت ملفاتك ليتم تحديثها عند الطلاب)
const CACHE_NAME = 'attendance-app-v2-face';

// رابط الموديلات الخارجي الذي استخدمناه
const MODEL_BASE = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// قائمة الملفات التي سيحفظها النظام في الذاكرة
const urlsToCache = [
    './',                 // الصفحة الرئيسية
    './index.html',       // ملف الواجهة
    './face-api.min.js',  // مكتبة الوجه
    './manifest.json',    // ملف الإعدادات
    './icon.png',         // أيقونة التطبيق
    
    // === ملفات الذكاء الاصطناعي (مهم جداً حفظها) ===
    `${MODEL_BASE}/tiny_face_detector_model-weights_manifest.json`,
    `${MODEL_BASE}/tiny_face_detector_model-shard1`,
    `${MODEL_BASE}/face_landmark_68_model-weights_manifest.json`,
    `${MODEL_BASE}/face_landmark_68_model-shard1`,
    `${MODEL_BASE}/face_recognition_model-weights_manifest.json`,
    `${MODEL_BASE}/face_recognition_model-shard1`,
    `${MODEL_BASE}/face_recognition_model-shard2`,
    `${MODEL_BASE}/face_expression_model-weights_manifest.json`,
    `${MODEL_BASE}/face_expression_model-shard1`
];

// 1. مرحلة التثبيت: تحميل وحفظ الملفات
self.addEventListener('install', event => {
    console.log('[Service Worker] جاري تثبيت الملفات...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] تم حفظ الموديلات بنجاح ✅');
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. مرحلة التفعيل: تنظيف الذاكرة القديمة
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] مسح ذاكرة قديمة');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. مرحلة الاستدعاء: العمل بدون إنترنت (Offline First)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إذا وجد الملف في الذاكرة، استخدمه فوراً (سريع جداً)
                if (response) {
                    return response;
                }
                // إذا لم يجده، اطلبه من الإنترنت
                return fetch(event.request);
            })
    );
});