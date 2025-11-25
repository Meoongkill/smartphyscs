<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'admin',
                'nik' => '0912098472',
                'nohp' => '111111111111',
                'alamat' => 'upi gimank',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        $psikolog = User::firstOrCreate(
            ['email' => 'psikolog@gmail.com'],
            [
                'name' => 'psikolog',
                'nik' => '09182039274011',
                'nohp' => '0090901902909',
                'alamat' => 'upi',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$psikolog->hasRole('psikolog')) {
            $psikolog->assignRole('psikolog');
        }

        $user = User::firstOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name' => 'user',
                'nik' => '019230998232',
                'nohp' => '01209029123',
                'alamat' => 'upi',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user->hasRole('user')) {
            $user->assignRole('user');
        }

        $user2 = User::firstOrCreate(
            ['email' => 'user2@gmail.com'],
            [
                'name' => 'user2',
                'nik' => '0192309982321',
                'nohp' => '012090291231',
                'alamat' => 'upi',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user2->hasRole('user')) {
            $user2->assignRole('user');
        }

        $user3 = User::firstOrCreate(
            ['email' => 'ahmad.rizki@gmail.com'],
            [
                'name' => 'Ahmad Rizki',
                'nik' => '0192309982322',
                'nohp' => '082123456789',
                'alamat' => 'Bandung',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user3->hasRole('user')) {
            $user3->assignRole('user');
        }

        $user4 = User::firstOrCreate(
            ['email' => 'siti.nurhaliza@gmail.com'],
            [
                'name' => 'Siti Nurhaliza',
                'nik' => '0192309982323',
                'nohp' => '082198765432',
                'alamat' => 'Jakarta',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user4->hasRole('user')) {
            $user4->assignRole('user');
        }

        if (!$user4->hasRole('user')) {
            $user4->assignRole('user');
        }

        $user5 = User::firstOrCreate(
            ['email' => 'budi.santoso@gmail.com'],
            [
                'name' => 'Budi Santoso',
                'nik' => '0192309982324',
                'nohp' => '081234567890',
                'alamat' => 'Surabaya',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user5->hasRole('user')) {
            $user5->assignRole('user');
        }

        // Tambahan user baru
        $user6 = User::firstOrCreate(
            ['email' => 'dewi.anggraeni@gmail.com'],
            [
                'name' => 'Dewi Anggraeni',
                'nik' => '0192309982325',
                'nohp' => '082345678901',
                'alamat' => 'Yogyakarta',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user6->hasRole('user')) {
            $user6->assignRole('user');
        }

        $user7 = User::firstOrCreate(
            ['email' => 'eko.prasetyo@gmail.com'],
            [
                'name' => 'Eko Prasetyo',
                'nik' => '0192309982326',
                'nohp' => '081987654321',
                'alamat' => 'Semarang',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user7->hasRole('user')) {
            $user7->assignRole('user');
        }

        $user8 = User::firstOrCreate(
            ['email' => 'fitri.handayani@gmail.com'],
            [
                'name' => 'Fitri Handayani',
                'nik' => '0192309982327',
                'nohp' => '082567890123',
                'alamat' => 'Medan',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user8->hasRole('user')) {
            $user8->assignRole('user');
        }

        $user9 = User::firstOrCreate(
            ['email' => 'gilang.ramadhan@gmail.com'],
            [
                'name' => 'Gilang Ramadhan',
                'nik' => '0192309982328',
                'nohp' => '081345678902',
                'alamat' => 'Malang',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user9->hasRole('user')) {
            $user9->assignRole('user');
        }

        $user10 = User::firstOrCreate(
            ['email' => 'hani.kusuma@gmail.com'],
            [
                'name' => 'Hani Kusuma',
                'nik' => '0192309982329',
                'nohp' => '082678901234',
                'alamat' => 'Makassar',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user10->hasRole('user')) {
            $user10->assignRole('user');
        }

        $user11 = User::firstOrCreate(
            ['email' => 'indra.gunawan@gmail.com'],
            [
                'name' => 'Indra Gunawan',
                'nik' => '0192309982330',
                'nohp' => '081456789012',
                'alamat' => 'Denpasar',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user11->hasRole('user')) {
            $user11->assignRole('user');
        }

        $user12 = User::firstOrCreate(
            ['email' => 'jasmine.putri@gmail.com'],
            [
                'name' => 'Jasmine Putri',
                'nik' => '0192309982331',
                'nohp' => '082789012345',
                'alamat' => 'Palembang',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user12->hasRole('user')) {
            $user12->assignRole('user');
        }

        $user13 = User::firstOrCreate(
            ['email' => 'kevin.wijaya@gmail.com'],
            [
                'name' => 'Kevin Wijaya',
                'nik' => '0192309982332',
                'nohp' => '081567890123',
                'alamat' => 'Tangerang',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user13->hasRole('user')) {
            $user13->assignRole('user');
        }

        $user14 = User::firstOrCreate(
            ['email' => 'linda.susanti@gmail.com'],
            [
                'name' => 'Linda Susanti',
                'nik' => '0192309982333',
                'nohp' => '082890123456',
                'alamat' => 'Bekasi',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user14->hasRole('user')) {
            $user14->assignRole('user');
        }

        $user15 = User::firstOrCreate(
            ['email' => 'muhammad.fajar@gmail.com'],
            [
                'name' => 'Muhammad Fajar',
                'nik' => '0192309982334',
                'nohp' => '081678901234',
                'alamat' => 'Bogor',
                'foto' => '-',
                'password' => bcrypt('12345678'),
            ]
        );
        if (!$user15->hasRole('user')) {
            $user15->assignRole('user');
        }
    }
}
