# Generated by Django 3.2.4 on 2021-07-02 09:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_withdrawrequest_txid'),
    ]

    operations = [
        migrations.CreateModel(
            name='Artwork',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=128)),
                ('description', models.TextField()),
                ('original_file', models.FileField(upload_to='')),
                ('censored_file', models.FileField(blank=True, null=True, upload_to='')),
                ('processed', models.BooleanField(default=False)),
                ('copies', models.PositiveBigIntegerField(default=1)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.profile')),
            ],
        ),
    ]
