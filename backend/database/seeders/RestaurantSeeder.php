<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\DiningTable;
use App\Models\MenuItem;
use App\Models\Profile;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        Profile::query()->create([
            'name' => 'دسترخوان',
            'tagline' => 'د کابل خوند، پر یوه دسترخوان',
            'hero_note' => 'زعفراني وریجې، د سکرو کباب، او هغه چای چې خبرې اوږدوي.',
            'about' => "دسترخوان د کابل یو افغاني رستورانت دی. دلته هغه خواړه پخیږي چې د کور له پخلنځي څخه راغلې دي: وریجې په زعفرانو، کباب پر سکرو، او نان له تنوره.\n\nیوه خونه یې د فرش دسترخوان دی، پر توشکو ناست. بله خونه سالون دی، که میز غواړئ. دواړه ځایونه د یوه خوند لپاره دي: چې ډوډۍ په بیړه خلاصه نشي.",
            'phone' => '+93 79 210 4480',
            'address' => 'کارته ۴، څلورمه کوڅه',
            'city' => 'کابل',
            'hours' => [
                ['days' => 'شنبه تر پنجشنبې', 'time' => '۱۲:۰۰ – ۲۲:۳۰'],
                ['days' => 'جمعه', 'time' => '۱۳:۰۰ – ۲۳:۰۰'],
            ],
        ]);

        $categories = [
            ['name' => 'وریجې', 'slug' => 'rice', 'description' => 'زعفراني پلو او چلو', 'sort_order' => 1],
            ['name' => 'کبابونه', 'slug' => 'kebab', 'description' => 'پر سکرو پخه شوي', 'sort_order' => 2],
            ['name' => 'ډوډۍ او اشتها', 'slug' => 'bread', 'description' => 'له تنوره او د پیل ډوډۍ', 'sort_order' => 3],
            ['name' => 'قورمې', 'slug' => 'stew', 'description' => 'ورو پخه شوي خوړن', 'sort_order' => 4],
            ['name' => 'څښاک', 'slug' => 'drinks', 'description' => 'چای، قیماق او دوغ', 'sort_order' => 5],
            ['name' => 'خواږه', 'slug' => 'dessert', 'description' => 'د ډوډۍ وروسته', 'sort_order' => 6],
        ];

        $categoryIds = [];

        foreach ($categories as $category) {
            $categoryIds[$category['slug']] = Category::query()->create($category)->id;
        }

        $items = [
            ['rice', 'قابلي پلو', 'qabili', 'زعفراني وریجې، د زردکو او ممیزو سره، او د پسه غوښې ټوټه.', 650, true, 1, 'platter', 1],
            ['rice', 'کوفته چلو', 'kofta', 'د غوښې کوفته په قورمه کې، له سپینو وریجو سره.', 540, false, 2, 'platter', 2],
            ['kebab', 'چکن تکہ', 'chicken-tikka', 'د سینې ټوټې په زعفرانو او مسالو کې، د سکرو کباب.', 520, true, 2, 'skewer', 1],
            ['kebab', 'سیخ کباب', 'seekh', 'د پسه قیمه پر سیخ، د سکرو له لوګي سره.', 580, false, 2, 'skewer', 2],
            ['kebab', 'چاپلي کباب', 'chapli', 'پخه قیمه، د کابل په مسالو، له نان سره.', 450, false, 3, 'platter', 3],
            ['bread', 'بولاني', 'bolani', 'نرۍ ډوډۍ د کچالو له ډکون سره، سره زرین پخه شوې.', 200, true, 1, 'bread', 1],
            ['bread', 'افغاني نان', 'nan', 'د تنور تازه نان.', 40, false, 0, 'bread', 2],
            ['bread', 'روغاني نان', 'roghani', 'په غوړیو غوړه شوې نان، له کنجدو سره.', 90, false, 0, 'bread', 3],
            ['stew', 'منتو', 'mantu', 'د غوښې ډمپلینګ، پر سر یې مستې او د دال ساس.', 480, true, 0, 'bowl', 1],
            ['stew', 'آش', 'aush', 'د رشتو او نخودو ښوروا، پر سر یې مستې او نعناع.', 380, false, 0, 'bowl', 2],
            ['stew', 'شوروا', 'shorwa', 'د غوښې رڼه ښوروا، له تنوري نان سره.', 280, false, 1, 'bowl', 3],
            ['stew', 'قرمه', 'qorma', 'د پسه غوښه په پیازو او مسالو کې ورو پخه شوې.', 500, false, 2, 'bowl', 4],
            ['stew', 'بامیه', 'bamya', 'بامیه له غوښې سره، د نان لپاره.', 360, false, 1, 'bowl', 5],
            ['drinks', 'شین چای', 'green-tea', 'په کیتلي کې، له الهېلې سره.', 60, false, 0, 'drink', 1],
            ['drinks', 'قیماق چای', 'qaimaq-tea', 'توره چای له قیماقه سره.', 120, false, 0, 'drink', 2],
            ['drinks', 'دوغ', 'doogh', 'د مستو یخ څښاک، په نعناع.', 80, false, 0, 'drink', 3],
            ['dessert', 'فیرني', 'firni', 'د شیدو خوږه، په ګلاب او پسته.', 180, true, 0, 'dessert', 1],
            ['dessert', 'باقلوا', 'baklava', 'د غوړو پاڼو خوږه، په پسته او عسل.', 220, false, 0, 'dessert', 2],
        ];

        foreach ($items as $item) {
            MenuItem::query()->create([
                'category_id' => $categoryIds[$item[0]],
                'name' => $item[1],
                'slug' => $item[2],
                'description' => $item[3],
                'price' => $item[4],
                'is_featured' => $item[5],
                'spice' => $item[6],
                'kind' => $item[7],
                'sort_order' => $item[8],
            ]);
        }

        $tables = [
            ['میز ۱', 2, -3.2, -2.2, 'round', 1],
            ['میز ۲', 4, 0.0, -2.4, 'round', 2],
            ['میز ۳', 2, 3.2, -2.2, 'round', 3],
            ['میز ۴', 4, -3.3, 0.6, 'round', 4],
            ['میز ۵', 6, 0.1, 0.8, 'rect', 5],
            ['میز ۶', 4, 3.3, 0.6, 'round', 6],
            ['میز ۷', 2, -2.2, 3.0, 'round', 7],
            ['میز ۸', 2, 2.2, 3.0, 'round', 8],
        ];

        foreach ($tables as $table) {
            DiningTable::query()->create([
                'label' => $table[0],
                'seats' => $table[1],
                'pos_x' => $table[2],
                'pos_z' => $table[3],
                'shape' => $table[4],
                'is_active' => true,
                'sort_order' => $table[5],
            ]);
        }
    }
}
