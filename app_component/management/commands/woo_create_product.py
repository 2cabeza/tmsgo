from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.utils import translation

from app_component.tasks import create_product


class Command(BaseCommand):

    def handle(self, *args, **options):
        # Activate a fixed locale, e.g. Russian
        translation.activate('es')
        # Or you can activate the LANGUAGE_CODE # chosen in the settings:
        translation.activate(settings.LANGUAGE_CODE)

        self.stdout.write(self.style.SUCCESS(create_product()))
        translation.deactivate()
