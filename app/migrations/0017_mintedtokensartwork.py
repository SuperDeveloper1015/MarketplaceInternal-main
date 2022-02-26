# Generated by Django 3.2.6 on 2021-10-25 01:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0016_profile_moderation_approved_by_default'),
    ]

    operations = [
        migrations.CreateModel(
            name='MintedTokensArtwork',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token_id', models.PositiveBigIntegerField()),
                ('artwork', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='arworks_minted_tokens', to='app.artwork')),
            ],
        ),
    ]
