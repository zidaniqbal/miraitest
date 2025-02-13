<?php

namespace App\Http\Controllers;

use App\Models\Zipcode;
use Illuminate\Http\Request;

class ZipcodeController extends Controller
{
    public function index()
    {
        return auth()->user()->zipcode;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'zipcode' => 'required|string',
            'address' => 'required|string',
        ]);

        $zipcode = Zipcode::updateOrCreate(
            ['user_id' => auth()->id()],
            $data
        );

        return response()->json($zipcode);
    }
}
