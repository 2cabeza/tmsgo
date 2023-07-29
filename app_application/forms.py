from django import forms
from django.contrib import admin
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.utils.translation import ugettext_lazy as _
from .models import *


class ListGroupPermissionForm(forms.ModelForm):
    lists = forms.ModelMultipleChoiceField(
        List.objects.exclude(parent_list=None),
        required=False,
        widget=FilteredSelectMultiple(
            _('lists'),
            False,
        )
    )
