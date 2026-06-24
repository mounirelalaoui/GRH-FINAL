<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Etablissement;
class EtablissementSeeder extends Seeder {
    public function run(): void {
        $data = [
            ['nom'=>'CFMR Casablanca','ville'=>'Casablanca'],
            ['nom'=>'CFMR Rabat','ville'=>'Rabat'],
            ['nom'=>'CFMR Marrakech','ville'=>'Marrakech'],
            ['nom'=>'CFMR Fès','ville'=>'Fès'],
            ['nom'=>'CFMR Agadir','ville'=>'Agadir'],
        ];
        foreach ($data as $d) Etablissement::create($d);
        $this->command->info('✓ Établissements: '.count($data));
    }
}
