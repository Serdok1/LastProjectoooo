# Generated by Django 5.1.1 on 2024-09-17 19:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userManage', '0003_profile_profile_picture'),
    ]

    operations = [
        migrations.CreateModel(
            name='SiteConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('default_profile_picture', models.ImageField(blank=True, null=True, upload_to='default_pictures/')),
            ],
            options={
                'verbose_name': 'Site Configuration',
                'verbose_name_plural': 'Site Configurations',
            },
        ),
    ]
