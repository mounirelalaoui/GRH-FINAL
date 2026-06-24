<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Diplome;
class DiplomeSeeder extends Seeder {
    public function run(): void {
        $diplomes = [
            'Licence en Informatique','Master Génie Logiciel','Licence Génie Civil',
            'DUT Réseaux et Télécommunications','BTS Informatique de Gestion',
            'Doctorat en Sciences',"Diplôme d'Ingénieur",'Licence en Économie',
            'Master Management','BTS Électronique',
        ];
        foreach ($diplomes as $d) Diplome::create(['nom_diplome'=>$d]);
        $this->command->info('✓ Diplômes: '.count($diplomes));
    }
}
