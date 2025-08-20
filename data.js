// --- Hike Data ---

const hikeStagesData = [
    {
        name: 'Stage 0:  Get to starting point', 
        kml: 'https://raw.githubusercontent.com/Brizzum/kml_data_repo/refs/heads/main/kml_slov/day0.kml', 
        distance: '3,02 km',
        time: '1 h 5 min',
        ascent: '172 m',
        descent: '26 m',
        difficulty: 'Easy',
        groundType: 'Path 80 %, Asphalt road 20 %'
    },
    
    { 
        name: 'Stage 1:  Valley Ascent', 
        kml: 'https://raw.githubusercontent.com/Brizzum/kml_data_repo/refs/heads/main/kml_slov/day1.kml', 
        distance: '9,02 km',
        time: '4 h 30 min',
        ascent: '1.188 m',
        descent: '56 m',
        difficulty: 'Easy',
        groundType: 'Path 56 %, Track 20 %, Forestry road 25 %'
    },

    { 
        name: 'Stage 2: Ridge Traverse', 
        kml: 'https://raw.githubusercontent.com/Brizzum/kml_data_repo/refs/heads/main/kml_slov/day2.kml', 
        distance: '3,61 km',
        time: '2 h 30 min',
        ascent: '703 m',
        descent: '15 m',
        difficulty: 'Difficult',
        groundType: 'Path 100 %'
    },


    { 
        name: 'Stage 3: Summit Push to Triglav', 
        kml: 'https://raw.githubusercontent.com/Brizzum/kml_data_repo/refs/heads/main/kml_slov/day3.kml', 
        distance: '4,57 km',
        time: '3 h 30 min',
        ascent: '420 m',
        descent: '785 m',
        difficulty: 'Very difficult',
        groundType: 'Path 63 %, Bad path 37 %'
    },

    
    { 
        name: 'Stage 4: Exit Triglav North face', 
        kml: 'https://raw.githubusercontent.com/Brizzum/kml_data_repo/refs/heads/main/kml_slov/day4.kml', 
        distance: '9,03 km',
        time: '5 h 30 min',
        ascent: '944 m',
        descent: '1.044 m',
        difficulty: 'Very difficult',
        groundType: 'Path 73 %, Bad path 27 %'
    },

    { 
        name: 'Stage 5:  Valley descent', 
        kml: 'https://raw.githubusercontent.com/Brizzum/kml_data_repo/refs/heads/main/kml_slov/day5.kml', 
        distance: '5,85 km',
        time: '3 h 30 min',
        ascent: '153 m',
        descent: '1.208 m',
        difficulty: 'Difficult',
        groundType: 'Path 98 %, No data 2 %'
    },


    { 
        name: 'Stage 6:  Around the valley', 
        kml: 'https://raw.githubusercontent.com/Brizzum/kml_data_repo/refs/heads/main/kml_slov/day6.kml', 
        distance: '14,89 km',
        time: '5 h',
        ascent: '357 m',
        descent: '483 m',
        difficulty: 'Easy',
        groundType: 'Path 47 %, Track 10 %, Macadam road 14 %, Asphalt road 27 %, No data 2 %'
    },

    { 
        name: 'Stage 7:  Up we go again', 
        kml: 'https://raw.githubusercontent.com/Brizzum/kml_data_repo/refs/heads/main/kml_slov/day7.kml', 
        distance: '6,03 km',
        time: '4 h 30 min',
        ascent: '1.068 m',
        descent: '304 m',
        difficulty: 'Difficult',
        groundType: 'Path 16 %, Bad path 44 %, Forestry road 39 %, Macadam road 1 %'
    },

    { 
        name: 'Stage 8:  Finishing trail ouw to the gorges', 
        kml: 'https://raw.githubusercontent.com/Brizzum/kml_data_repo/refs/heads/main/kml_slov/day8.kml', 
        distance: '12,62 km',
        time: '4 h 30 min',
        ascent: '60 m',
        descent: '1.046 m',
        difficulty: 'Easy',
        groundType: 'Path 56 %, Bad track 11 %, Forestry road 26 %, No data 7 %'
    },    


];

const hutsData = [ 
    { name: 'Planinska koča na Vojah', lat: 46.310094, lon: 13.882413, alt: 698},
    { name: 'Vodnikov dom na Velem', lat: 46.355918, lon: 13.861450, alt: 1820},
    { name: 'Kredarici hut', lat: 46.378858, lon:  13.848988, alt:  2515},
    { name: 'Koča na Doliču', lat: 46.364943, lon: 13.819535 , alt: 2150},
    { name: 'Pogačnikov dom na Kriških podih', lat: 46.401849, lon: 13.800737, alt: 2050},
    { name: 'Aljažev dom v Vratih', lat: 46.409402, lon: 13.843458 , alt: 1001},
    { name: 'Kovinarska koča v Krmi', lat: 46.400456, lon: 13.923667, alt: 869},
    { name: 'Blejska koča na Lipanci', lat: 46.375159, lon: 13.927598, alt: 1631}
];