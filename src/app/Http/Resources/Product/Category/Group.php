<?php

namespace App\Http\Resources\Product\Category;

use Illuminate\Http\Resources\Json\JsonResource;

class Group extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'   => $this->id,
            'name' => $this->name
        ];
    }
}
