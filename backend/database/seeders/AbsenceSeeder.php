<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\{Absence,Personnel};
use Carbon\Carbon;
class AbsenceSeeder extends Seeder {
    public function run(): void {
        $personnels = Personnel::pluck('idPersonnel')->toArray();
        $motifs = ['Maladie','Urgence familiale','Rendez-vous médical',null,'Problème personnel'];
        $count  = 0;
        foreach ($personnels as $idPersonnel) {
            $nb = rand(2,8);
            for ($i=0; $i<$nb; $i++) {
                Absence::create(['idPersonnel'=>$idPersonnel,'date_absence'=>Carbon::now()->subDays(rand(1,90))->toDateString(),'motif'=>$motifs[array_rand($motifs)]]);
                $count++;
            }
        }
        $this->command->info("✓ Absences: $count");
    }
}
