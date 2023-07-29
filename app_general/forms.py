from django import forms
from django.contrib.postgres.fields import JSONField
from app_general.models import FieldName


class ColumnAttrForm(forms.ModelForm):
    column_attr = forms.CharField(widget=forms.Textarea(), initial="{'size-xs': '12', 'size-md': '6', 'size-lg': '6'}")
    input_value = forms.CharField(widget=forms.Textarea(), initial="{'context': '', "
                                                                   "'context_id': '', "
                                                                   "'value': null}")

    class Meta:
        model = FieldName
        fields = '__all__'
