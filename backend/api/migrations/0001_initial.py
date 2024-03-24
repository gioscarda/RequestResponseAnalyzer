# Generated by Django 5.0.3 on 2024-03-18 18:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Request',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('method', models.CharField(choices=[('GET', 'GET'), ('POST', 'POST'), ('PUT', 'PUT'), ('DELETE', 'DELETE'), ('INFO', 'INFO'), ('DUMB', 'DUMB')], max_length=10)),
                ('url', models.URLField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.PositiveSmallIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Response',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('protocol', models.CharField(default='HTTP/1.1', max_length=10)),
                ('status', models.PositiveSmallIntegerField()),
                ('reason', models.CharField(max_length=50)),
                ('date', models.DateField()),
                ('location', models.CharField(max_length=255)),
                ('server', models.CharField(max_length=100)),
                ('request', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='responses', to='api.request')),
            ],
        ),
        migrations.AddField(
            model_name='request',
            name='status',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='requests', to='api.status'),
        ),
        migrations.CreateModel(
            name='URLInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('domain', models.CharField(max_length=255)),
                ('scheme', models.CharField(max_length=4)),
                ('path', models.CharField(max_length=255)),
                ('request', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='url_info', to='api.request')),
            ],
        ),
    ]