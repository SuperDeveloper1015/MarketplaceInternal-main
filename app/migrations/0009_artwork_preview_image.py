# Generated by Django 3.2.4 on 2021-08-02 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_auto_20210802_1320'),
    ]

    operations = [
        migrations.AddField(
            model_name='artwork',
            name='preview_image',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]