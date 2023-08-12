from woocommerce import API

DEBUG = True

# Database local
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'fbdb',
        'HOST': 'localhost',
        'USER': 'postgres',
        'PASSWORD': '357357',
        'PORT': '5432',
    }
}

wcapi = API(
    url="http://example.com",
    consumer_key="ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    consumer_secret="cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    version="wc/v3"
)
