@extends('layouts.app')

@section('title', 'Salesapp Point of Sale')
@section('description', 'Point of Sale for live event purchases')

@section('head-content')

    <link rel="stylesheet" href="{{ asset('css/pos.css') }}">

@endsection

@section('content')

    <div id="App"></div>

@endsection

@section('async')

    <script type="text/javascript" src="{{ asset('js/bundle.js') }}"></script>

@endsection
