# Generated by Django 5.1.1 on 2024-09-17 21:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userManage', '0004_siteconfig'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='bio',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='phone_number',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
    ]
