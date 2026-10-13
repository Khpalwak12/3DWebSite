<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->json('translations')->nullable()->after('hours');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->json('translations')->nullable()->after('description');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->json('translations')->nullable()->after('description');
            $table->json('images')->nullable()->after('translations');
        });

        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_contents');
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn(['translations', 'images']);
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('translations');
        });
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('translations');
        });
    }
};
