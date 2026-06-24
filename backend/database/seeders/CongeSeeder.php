<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\{Conge,Personnel};
use Carbon\Carbon;
class CongeSeeder extends Seeder {
    public function run(): void {
        $personnels = Personnel::pluck('idPersonnel')->toArray();
        $conges = [
            ['idPersonnel'=>$personnels[0],'type_conge'=>'Congé annuel','date_debut'=>Carbon::now()->addDays(10),'date_fin'=>Carbon::now()->addDays(25),'date_demande'=>Carbon::now()->subDays(5),'statut'=>'en_attente'],
            ['idPersonnel'=>$personnels[1],'type_conge'=>'Congé maladie','date_debut'=>Carbon::now()->subDays(20),'date_fin'=>Carbon::now()->subDays(17),'date_demande'=>Carbon::now()->subDays(22),'statut'=>'approuve'],
            ['idPersonnel'=>$personnels[2],'type_conge'=>'Congé annuel','date_debut'=>Carbon::now()->addMonths(1),'date_fin'=>Carbon::now()->addMonths(1)->addDays(14),'date_demande'=>Carbon::now(),'statut'=>'en_attente'],
            ['idPersonnel'=>$personnels[3],'type_conge'=>'Congé exceptionnel','date_debut'=>Carbon::now()->subDays(30),'date_fin'=>Carbon::now()->subDays(27),'date_demande'=>Carbon::now()->subDays(32),'statut'=>'refuse'],
            ['idPersonnel'=>$personnels[4],'type_conge'=>'Congé sans solde','date_debut'=>Carbon::now()->addDays(5),'date_fin'=>Carbon::now()->addDays(10),'date_demande'=>Carbon::now()->subDays(2),'statut'=>'approuve'],
        ];
        foreach ($conges as $c) Conge::create($c);
        $this->command->info('✓ Congés: '.count($conges));
    }
}
