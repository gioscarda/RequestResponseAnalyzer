# Generated by Django 5.0.3 on 2024-03-28 21:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='urlinfo',
            name='scheme',
            field=models.CharField(max_length=10),
        ),
    ]