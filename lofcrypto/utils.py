import hashlib
import hmac
import time

import requests
from django.core.cache import cache
from graphql import GraphQLError
from dynamic_preferences.registries import global_preferences_registry
from dynamic_preferences.settings import preferences_settings
from dynamic_preferences.types import BasePreferenceType


global_preferences = global_preferences_registry.manager()


def validate_nonce(nonce):
    cache_key = 'nonce:{}'.format(nonce)
    if cache.get(cache_key) is None:
        raise GraphQLError('Invalid nonce')
    cache.delete(cache_key)


class SumSub:
    @staticmethod
    def api_host():
        return 'https://test-api.sumsub.com'

    def get_access_token(self, profile):
        print({'userId': str(profile.pk), 'ttlInSecs': '3600'})
        req = self.sign_request(requests.Request('POST', self.api_host() + '/resources/accessTokens',
                                                 params={'userId': str(profile.pk), 'ttlInSecs': '3600'}))
        r = requests.Session().send(req).json()
        print(r)
        return r['token']

    def sign_request(self, request: requests.Request):
        prepared_request = request.prepare()
        now = int(time.time())
        method = request.method.upper()
        path_url = prepared_request.path_url  # includes encoded query params
        # could be None so we use an empty **byte** string here
        body = b'' if prepared_request.body is None else prepared_request.body
        if type(body) == str:
            body = body.encode('utf-8')
        data_to_sign = str(now).encode('utf-8') + method.encode('utf-8') + path_url.encode('utf-8') + body
        # hmac needs bytes
        signature = hmac.new(
            'UHQrMT7hSMhucWn1y6emIkWxOfqBy0Ol'.encode('utf-8'),
            data_to_sign,
            digestmod=hashlib.sha256
        )
        prepared_request.headers['X-App-Token'] = 'tst:7M6M9E6ym2AofHhUOpSkUWLR.1mi0r4mGBIfGovFe99Kqi9mQkursUFH0'
        prepared_request.headers['X-App-Access-Ts'] = str(now)
        prepared_request.headers['X-App-Access-Sig'] = signature.hexdigest()
        return prepared_request


class PreferenceMixin(BasePreferenceType):
    @classmethod
    def key(cls):
        return '{}{}{}'.format(cls.section.name,
                               preferences_settings.SECTION_KEY_SEPARATOR,
                               cls.name)

    @classmethod
    def value(cls):
        return global_preferences[cls.key()]

