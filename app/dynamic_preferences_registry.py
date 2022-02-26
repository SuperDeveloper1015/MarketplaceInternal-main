from decimal import Decimal

from dynamic_preferences.preferences import Section
from dynamic_preferences.registries import global_preferences_registry
from dynamic_preferences.types import DecimalPreference

from lofcrypto.utils import PreferenceMixin

collected_section = Section('collected')


@global_preferences_registry.register
class Collected5(DecimalPreference, PreferenceMixin):
    section = collected_section
    name = 'collected_5'
    default = Decimal(0)


@global_preferences_registry.register
class Collected10(DecimalPreference, PreferenceMixin):
    section = collected_section
    name = 'collected_10'
    default = Decimal(0)
