<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Specialite;
class SpecialiteSeeder extends Seeder {
    public function run(): void {
        $specialites = [
            'Informatique et Réseaux','Génie Civil','Électronique',
            'Comptabilité et Gestion','Mécanique Auto','Ressources Humaines',
            'Marketing et Commerce','Électrotechnique','Froid et Climatisation',
            'Bâtiment et Travaux Publics','Cuisine et Arts Culinaires','Tourisme et Hôtellerie',
        ];
        foreach ($specialites as $s) Specialite::create(['nom_specialite'=>$s]);
        $this->command->info('✓ Spécialités: '.count($specialites));
    }
}
