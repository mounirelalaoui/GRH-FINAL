<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\{User,Personnel};
class UserSeeder extends Seeder {
    public function run(): void {
        User::create(['username'=>'directeur','email'=>'directeur@cfmr.ma','password'=>Hash::make('password123'),'Role'=>'directeurducomlex','idPersonnel'=>Personnel::where('CIN','AB123456')->value('idPersonnel'),'active'=>true]);
        User::create(['username'=>'gestionnaire','email'=>'gestionnaire@cfmr.ma','password'=>Hash::make('password123'),'Role'=>'gestionnairecfmr','idPersonnel'=>Personnel::where('CIN','FZ789012')->value('idPersonnel'),'active'=>true]);
        $this->command->info('✓ Utilisateurs créés');
        $this->command->info('  directeur@cfmr.ma / password123 (Directeur)');
        $this->command->info('  gestionnaire@cfmr.ma / password123 (Gestionnaire)');
    }
}
