<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\{Personnel,Etablissement,Specialite,Diplome};
class PersonnelSeeder extends Seeder {
    public function run(): void {
        $etabs       = Etablissement::pluck('idEtab')->toArray();
        $specialites = Specialite::pluck('idSpecialite')->toArray();
        $diplomes    = Diplome::pluck('idDiplome')->toArray();
        $data = [
            ['type_personnel'=>'formateur','statut'=>'permanent','CIN'=>'AB123456','nom'=>'Benali','prenom'=>'Ahmed','date_naissance'=>'1980-03-15','situation_familiale'=>'Marié(e)','adresse_actuelle'=>'12 Rue Hassan II, Casablanca','lieu_naissance'=>'Casablanca','nombre_enfant'=>'2','telephone'=>'+212612345678','grade'=>"Professeur de l'enseignement supérieur",'echelon'=>'5','fonction'=>'Chef de département','contact_nom'=>'Fatima Benali','contact_telephone'=>'+212612345699','idEtab'=>$etabs[0],'idSpecialite'=>$specialites[0]],
            ['type_personnel'=>'administratif','statut'=>'permanent','CIN'=>'FZ789012','nom'=>'Zahra','prenom'=>'Fatima','date_naissance'=>'1985-07-22','situation_familiale'=>'Célibataire','adresse_actuelle'=>'5 Avenue Mohammed V, Rabat','lieu_naissance'=>'Rabat','nombre_enfant'=>'0','telephone'=>'+212698765432','grade'=>'Administrateur','echelon'=>'3','fonction'=>'Responsable RH','contact_nom'=>'','contact_telephone'=>'','idEtab'=>$etabs[1],'idSpecialite'=>null],
            ['type_personnel'=>'formateur','statut'=>'permanent','CIN'=>'YM345678','nom'=>'Mansouri','prenom'=>'Youssef','date_naissance'=>'1978-11-10','situation_familiale'=>'Marié(e)','adresse_actuelle'=>'8 Rue des Orangers, Casablanca','lieu_naissance'=>'Marrakech','nombre_enfant'=>'3','telephone'=>'+212655443322','grade'=>'Formateur principal','echelon'=>'7','fonction'=>'Formateur en Génie Civil','contact_nom'=>'','contact_telephone'=>'','idEtab'=>$etabs[0],'idSpecialite'=>$specialites[1]],
            ['type_personnel'=>'administratif','statut'=>'permanent','CIN'=>'NO901234','nom'=>'Ouali','prenom'=>'Nadia','date_naissance'=>'1990-05-18','situation_familiale'=>'Marié(e)','adresse_actuelle'=>'22 Bd Zerktouni, Marrakech','lieu_naissance'=>'Agadir','nombre_enfant'=>'1','telephone'=>'+212677889900','grade'=>'Secrétaire de direction','echelon'=>'2','fonction'=>'Assistante de direction','contact_nom'=>'','contact_telephone'=>'','idEtab'=>$etabs[2],'idSpecialite'=>null],
            ['type_personnel'=>'formateur','statut'=>'vacataire','CIN'=>'KR567890','nom'=>'Rachidi','prenom'=>'Karim','date_naissance'=>'1988-09-03','situation_familiale'=>'Célibataire','adresse_actuelle'=>'3 Rue Patrice Lumumba, Rabat','lieu_naissance'=>'Fès','nombre_enfant'=>'0','telephone'=>'+212644556677','grade'=>'Formateur vacataire','echelon'=>'1','fonction'=>'Formateur en Électronique','contact_nom'=>'','contact_telephone'=>'','idEtab'=>$etabs[1],'idSpecialite'=>$specialites[2]],
        ];
        foreach ($data as $p) {
            $personnel = Personnel::create($p);
            $personnel->diplomes()->sync(array_slice($diplomes, 0, rand(1,3)));
            if ($p['type_personnel'] === 'formateur') {
                $personnel->specialitesEnseignees()->sync([$p['idSpecialite']]);
            }
        }
        $this->command->info('✓ Personnels: '.count($data));
    }
}
