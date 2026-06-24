<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder {
    public function run(): void {
        $this->call([
            EtablissementSeeder::class,
            SpecialiteSeeder::class,
            DiplomeSeeder::class,
            PersonnelSeeder::class,
            UserSeeder::class,
            CongeSeeder::class,
            AbsenceSeeder::class,
        ]);
    }
}
