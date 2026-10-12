<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        if ($request->boolean('featured')) {
            $items = MenuItem::query()
                ->with('category')
                ->where('is_featured', true)
                ->orderBy('sort_order')
                ->get();

            return response()->json([
                'items' => $items->map(fn (MenuItem $item) => $this->item($item))->values(),
            ]);
        }

        $categories = Category::query()
            ->with(['menuItems' => fn ($query) => $query->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'categories' => $categories->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'items' => $category->menuItems->map(fn (MenuItem $item) => $this->item($item))->values(),
            ])->values(),
        ]);
    }

    private function item(MenuItem $item): array
    {
        return [
            'id' => $item->id,
            'name' => $item->name,
            'slug' => $item->slug,
            'description' => $item->description,
            'price' => (float) $item->price,
            'featured' => $item->is_featured,
            'spice' => $item->spice,
            'kind' => $item->kind,
            'category' => $item->category?->name,
        ];
    }
}
