from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Creating users (superheroes)...')
        users = [
            User(name='Tony Stark', email='tony@avengers.com', password='ironman123'),
            User(name='Steve Rogers', email='steve@avengers.com', password='cap123'),
            User(name='Natasha Romanoff', email='natasha@avengers.com', password='widow123'),
            User(name='Bruce Wayne', email='bruce@dc.com', password='batman123'),
            User(name='Diana Prince', email='diana@dc.com', password='wonder123'),
            User(name='Clark Kent', email='clark@dc.com', password='superman123'),
        ]
        for user in users:
            user.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(users)} users'))

        self.stdout.write('Creating teams...')
        marvel_members = [u.name for u in User.objects.filter(email__endswith='@avengers.com')]
        dc_members = [u.name for u in User.objects.filter(email__endswith='@dc.com')]
        teams = [
            Team(name='Team Marvel', members=marvel_members),
            Team(name='Team DC', members=dc_members),
        ]
        for team in teams:
            team.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(teams)} teams'))

        self.stdout.write('Creating activities...')
        activities = [
            Activity(user='Tony Stark', type='Running', duration='30 mins', date=date(2024, 1, 15)),
            Activity(user='Steve Rogers', type='Weight Training', duration='60 mins', date=date(2024, 1, 15)),
            Activity(user='Natasha Romanoff', type='Yoga', duration='45 mins', date=date(2024, 1, 16)),
            Activity(user='Bruce Wayne', type='Martial Arts', duration='90 mins', date=date(2024, 1, 16)),
            Activity(user='Diana Prince', type='Swimming', duration='45 mins', date=date(2024, 1, 17)),
            Activity(user='Clark Kent', type='Flying', duration='20 mins', date=date(2024, 1, 17)),
        ]
        for activity in activities:
            activity.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(activities)} activities'))

        self.stdout.write('Creating leaderboard entries...')
        leaderboard = [
            Leaderboard(user='Steve Rogers', score=950),
            Leaderboard(user='Tony Stark', score=870),
            Leaderboard(user='Bruce Wayne', score=840),
            Leaderboard(user='Diana Prince', score=800),
            Leaderboard(user='Natasha Romanoff', score=760),
            Leaderboard(user='Clark Kent', score=720),
        ]
        for entry in leaderboard:
            entry.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(leaderboard)} leaderboard entries'))

        self.stdout.write('Creating workouts...')
        workouts = [
            Workout(name='Avengers Assemble Circuit', description='Full body circuit inspired by the Avengers. Includes running, lifting, and agility drills.', duration='60 mins'),
            Workout(name='Bat Training Regimen', description='Batman\'s legendary training routine including martial arts, strength, and endurance.', duration='90 mins'),
            Workout(name='Wonder Woman Warrior Workout', description='Combat and strength training fit for an Amazon warrior.', duration='75 mins'),
            Workout(name='Iron Man Suit-Up Drill', description='High-intensity interval training to match Tony\'s repulsor-powered demands.', duration='45 mins'),
            Workout(name='Super Soldier Sprint', description='Steve Rogers\' enhanced conditioning: sprints, push-ups, and combat readiness.', duration='50 mins'),
        ]
        for workout in workouts:
            workout.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts)} workouts'))

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
