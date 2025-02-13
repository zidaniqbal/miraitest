<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Diary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Exception;

class DiaryController extends Controller
{
    public function index()
    {
        try {
            $diaries = auth()->user()->diaries()
                ->orderBy('date', 'desc')
                ->get();
            return response()->json($diaries);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch diaries',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'detail' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ], [
            'image.max' => 'The image must not be larger than 2MB.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg.',
        ]);

        try {
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('diary-images', 'public');
                $validated['image'] = $path;
            }

            $validated['user_id'] = auth()->id();
            $diary = Diary::create($validated);

            return response()->json($diary, 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to create diary entry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Diary $diary)
    {
        if ($diary->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($diary);
    }

    public function update(Request $request, Diary $diary)
    {
        if ($diary->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'detail' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($request->hasFile('image')) {
            if ($diary->image) {
                Storage::disk('public')->delete($diary->image);
            }
            $path = $request->file('image')->store('diary-images', 'public');
            $validated['image'] = $path;
        }

        $diary->update($validated);
        return response()->json($diary);
    }

    public function destroy(Diary $diary)
    {
        if ($diary->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($diary->image) {
            Storage::disk('public')->delete($diary->image);
        }

        $diary->delete();
        return response()->json(['message' => 'Diary deleted successfully']);
    }
}