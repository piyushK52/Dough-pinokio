# Generated by Django 4.2.1 on 2023-08-15 07:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("backend", "0004_credits_added_in_user"),
    ]

    operations = [
        migrations.AddField(
            model_name="aimodel",
            name="model_type",
            field=models.TextField(blank=True, default=""),
        ),
    ]