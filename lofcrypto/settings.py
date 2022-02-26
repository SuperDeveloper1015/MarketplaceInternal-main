from decimal import Decimal
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()

env_file = BASE_DIR / '.env'
if env_file.exists():
    env.read_env(str(env_file))
SECRET_KEY = 'django-insecure-))iq35&kgq3qd$#hyd7ir$7oem&z+-j4*bx!w4ur+s44x%mkh3'
DEBUG = env.bool('DJANGO_DEBUG', True)
ALLOWED_HOSTS = ['*']
REDIS_URL = env.str('REDIS_URL', 'redis://localhost:6379/1')

INSTALLED_APPS = [
    'whitenoise.runserver_nostatic',

    'graphene_django',
    'dbsettings',
    'constance',
    'admin_actions',
    'sorl.thumbnail',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'app',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'spa.middleware.SPAMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'lofcrypto.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates']
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'lofcrypto.wsgi.application'

DATABASES = {
    'default': env.db('DATABASE_URL', default='sqlite:///db.sqlite3'),
}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_L10N = False
USE_TZ = True

STATICFILES_DIRS = [
    BASE_DIR / 'frontend/build',
]

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {},
    'formatters': {
        'django.server': {
            '()': 'django.utils.log.ServerFormatter',
            'format': '[{server_time}] {message}',
            'style': '{',
        }
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'django.server',
        },
        'django.server': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'django.server',
        }
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        'django.server': {
            'handlers': ['django.server'],
            'level': 'INFO',
            'propagate': False,
        },
    }
}

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"

PUBLIC_ROOT = BASE_DIR / 'public'
STATIC_URL = '/static/'
STATIC_ROOT = PUBLIC_ROOT / 'static'
MEDIA_URL = '/uploads/'
MEDIA_ROOT = PUBLIC_ROOT / 'uploads'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

GRAPHENE = {
    'SCHEMA': 'app.schema.schema',
    'MIDDLEWARE': [
        'lofcrypto.middlewares.AuthMiddleware',
    ],
}

CORS_ORIGIN_WHITELIST = [
    'http://localhost:32955',
    'http://dev.bennnnsss.com:32955',
    'http://dev.bennnnsss.com:28000',
    'http://dev.bennnnsss.com:38000',
    'https://32955.dev.bennnnsss.com',
    'http://lofcrypto.surge.sh',
]

CONSTANCE_CONFIG = {
    'MASTER_ADDRESS': ('', ''),
    'MASTER_PK': ('', ''),
    'LOF_PRICE': (Decimal('.001'), 'In BNB'),
    'SIGNER_PK': ('d7d17e266c0aeabaf841216ea6bcc4e2bf3693d57a94884611e1e948367ce5a3', ''),
}

DBSETTINGS_VALUE_LENGTH = 2048
STATICFILES_STORAGE = 'spa.storage.SPAStaticFilesStorage'