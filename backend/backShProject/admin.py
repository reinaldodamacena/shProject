from django.contrib import admin
from django.apps import apps
from django.contrib.auth.models import Group

# unregister the Group model
admin.site.unregister(Group)

models = apps.get_models()

for model in models:
    if model._meta.model_name != 'user':
        admin.site.register(model)