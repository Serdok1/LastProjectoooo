# Generated by Django 3.2.25 on 2024-11-16 19:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pongGame', '0004_auto_20241116_1518'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='gamehistory',
            name='winner',
        ),
        migrations.AddField(
            model_name='gamehistory',
            name='is_winner',
            field=models.BooleanField(default=False),
        ),
    ]