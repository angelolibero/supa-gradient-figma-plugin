//Gradient Library (samples of gradients)

export const GRADIENTS_COLOR_CATEGORIES: any[number] = [
    {name: 'red', bgColor: '#FF0845'},
    {name: 'orange', bgColor: '#FF8B20'},
    {name: 'yellow', bgColor: '#efce28'},
    {name: 'green', bgColor: '#3cd34f'},
    {name: 'blue', bgColor: '#0538ff'},
    {name: 'cyan', bgColor: '#07e2ff'},
    {name: 'purple', bgColor: '#b280f5'},
    {name: 'pink', bgColor: '#ff9a9e'},
    {name: 'light', bgColor: '#eaeaea'},
    {name: 'dark', bgColor: '#333333'},
];

export const LINEAR_GRADIENTS_LIBRARY = [
    {
        name: 'red',
        bgColor: '#cb2d3e',
        paints: [
            {
                name: 'Red 01',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9800000190734863, g: 0.27000001072883606, b: 0.27000001072883606, a: 1}, position: 0},
                    {color: {r: 0.9599999785423279, g: 0.4399999976158142, b: 0.44999998807907104, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Red 02',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9800000190734863, g: 0.4399999976158142, b: 0.6000000238418579, a: 1}, position: 0},
                    {color: {r: 1, g: 0.4399999976158142, b: 0.25, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Red 03',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9399999976158142, g: 0.5799999833106995, b: 0.9800000190734863, a: 1}, position: 0},
                    {color: {r: 0.9599999785423279, g: 0.3400000035762787, b: 0.4300000071525574, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Red 04',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 1, g: 0.029999999329447746, b: 0.27000001072883606, a: 1}, position: 0},
                    {color: {r: 1, g: 0.6899999976158142, b: 0.6000000238418579, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [6.123234262925839e-17, -1, 1],
                    [1, 6.123234262925839e-17, 0],
                ],
            },
            {
                name: 'Red 05',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 1, g: 0.029999999329447746, b: 0.27000001072883606, a: 1}, position: 0},
                    {color: {r: 1, g: 0.6899999976158142, b: 0.6000000238418579, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
            ,
            {
                name: 'Red 06',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 1, g: 0.32099997997283936, b: 0.029999971389770508, a: 1}, position: 0},
                    {color: {r: 0.9499999284744263, g: 0.5779166221618652, b: 0.5779166221618652, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
        ],
    },
    {
        name: 'orange',
        bgColor: '#FF8B20',
        paints: [
            {
                name: 'Orange 01',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 1, g: 0.550000011920929, b: 0.12999999523162842, a: 1}, position: 0},
                    {color: {r: 0.9800000190734863, g: 0.7799999713897705, b: 0.30000001192092896, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Orange 02',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 1, g: 0.550000011920929, b: 0.12999999523162842, a: 1}, position: 0},
                    {color: {r: 1, g: 0.8799999952316284, b: 0.25, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Orange 03',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 1, g: 0.550000011920929, b: 0.12999999523162842, a: 1}, position: 0},
                    {color: {r: 0.9599999785423279, g: 0.3400000035762787, b: 0.4300000071525574, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Orange 04',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 1, g: 0.550000011920929, b: 0.12999999523162842, a: 1}, position: 0},
                    {color: {r: 1, g: 0.3799999952316284, b: 0.12999999523162842, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Orange 05',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 1, g: 0.550000011920929, b: 0.12999999523162842, a: 1}, position: 0},
                    {color: {r: 1, g: 0.6899999976158142, b: 0.6000000238418579, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
            {
                name: 'Orange 06',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 1, g: 0.550000011920929, b: 0.12999999523162842, a: 1}, position: 0},
                    {color: {r: 0.8999999761581421, g: 0.949999988079071, b: 0.5799999833106995, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
        ],
    },
    {
        name: 'yellow',
        bgColor: '#ffd200',
        paints: [
            {
                name: 'Yellow 01',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.800000011920929, g: 0.7900000214576721, b: 0.2199999988079071, a: 1}, position: 0},
                    {color: {r: 0.949999988079071, g: 0.7799999713897705, b: 0.33000001311302185, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Yellow 02',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.6399999856948853, g: 0.8700000047683716, b: 0.3799999952316284, a: 1}, position: 0},
                    {color: {r: 0.9399999976158142, g: 0.8100000023841858, b: 0.1599999964237213, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Yellow 03',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9200000166893005, g: 0.7699999809265137, b: 0.23999999463558197, a: 1}, position: 0},
                    {color: {r: 1, g: 0.8199999928474426, b: 0.5600000023841858, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Yellow 04',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9599999785423279, g: 0.9300000071525574, b: 0.2800000011920929, a: 1}, position: 0},
                    {color: {r: 0.5, g: 0.9599999785423279, b: 0.9100000262260437, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.7071067690849304, -0.7071067690849304, 0.5],
                    [0.7071067690849304, 0.7071067690849304, -0.2071067839860916],
                ],
            },
            {
                name: 'Yellow 05',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9599999785423279, g: 1, b: 0.6499999761581421, a: 1}, position: 0},
                    {color: {r: 0.9599999785423279, g: 0.6899999976158142, b: 0.5, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
            {
                name: 'Yellow 06',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9599999785423279, g: 1, b: 0.6499999761581421, a: 1}, position: 0},
                    {color: {r: 0.9599999785423279, g: 0.8899999856948853, b: 0.5, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
        ],
    },

    {
        name: 'green',
        bgColor: '#159957',
        paints: [
            {
                name: 'Green 01',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.8313725590705872, g: 0.9882352948188782, b: 0.4745098054409027, a: 1}, position: 0},
                    {color: {r: 0.5882353186607361, g: 0.9019607901573181, b: 0.6313725709915161, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Green 02',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.5176470875740051, g: 0.9803921580314636, b: 0.6901960968971252, a: 1}, position: 0},
                    {color: {r: 0.5607843399047852, g: 0.8274509906768799, b: 0.95686274766922, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Green 03',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.16470588743686676, g: 0.9607843160629272, b: 0.5960784554481506, a: 1}, position: 0},
                    {color: {r: 0, g: 0.6196078658103943, b: 0.9921568632125854, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Green 04',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.21568627655506134, g: 0.9254902005195618, b: 0.729411780834198, a: 1}, position: 0},
                    {color: {r: 0.4470588266849518, g: 0.686274528503418, b: 0.8274509906768799, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [6.123234262925839e-17, -1, 1],
                    [1, 6.123234262925839e-17, 0],
                ],
            },
            {
                name: 'Green 05',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.21568627655506134, g: 0.9254902005195618, b: 0.729411780834198, a: 1}, position: 0},
                    {color: {r: 0.46000000834465027, g: 0.8299999833106995, b: 0.44999998807907104, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
            ,
            {
                name: 'Green 06',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.2274509072303772, g: 0.3954509496688843, b: 0.8274510502815247, a: 1}, position: 0},
                    {color: {r: 0.46000000834465027, g: 0.8299999833106995, b: 0.44999998807907104, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
        ],
    },
    {
        name: 'blue',
        bgColor: '#155799',
        paints: [
            {
                name: 'Blue 01',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.020833313465118408, g: 0.22029313445091248, b: 1, a: 1}, position: 0},
                    {color: {r: 0.4399999976158142, g: 0.8899999856948853, b: 0.9599999785423279, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Blue 02',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.019607843831181526, g: 0.21960784494876862, b: 1, a: 1}, position: 0},
                    {color: {r: 0.25, g: 1, b: 0.7799999713897705, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Blue 03',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.019607843831181526, g: 0.21960784494876862, b: 1, a: 1}, position: 0},
                    {color: {r: 0.41999998688697815, g: 0.3400000035762787, b: 0.9599999785423279, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Blue 04',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.019607843831181526, g: 0.21960784494876862, b: 1, a: 1}, position: 0},
                    {color: {r: 0.3400000035762787, g: 0.6000000238418579, b: 0.9700000286102295, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [6.123234262925839e-17, -1, 1],
                    [1, 6.123234262925839e-17, 0],
                ],
            },
            {
                name: 'Blue 05',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.019607843831181526, g: 0.21960784494876862, b: 1, a: 1}, position: 0},
                    {color: {r: 0.3400000035762787, g: 0.6000000238418579, b: 0.9700000286102295, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
            {
                name: 'Blue 06',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.019607841968536377, g: 0.5882351994514465, b: 1, a: 1}, position: 0},
                    {color: {r: 0.3400000035762787, g: 0.6000000238418579, b: 0.9700000286102295, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
        ],
    },
    {
        name: 'cyan',
        bgColor: '#1cb5e0',
        paints: [
            {
                name: 'Cyan 01',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.029999999329447746, g: 0.8899999856948853, b: 1, a: 1}, position: 0},
                    {color: {r: 0.3400000035762787, g: 0.6000000238418579, b: 0.9700000286102295, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
            {
                name: 'Cyan 02',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.23999999463558197, g: 0.550000011920929, b: 0.9800000190734863, a: 1}, position: 0},
                    {color: {r: 0.25, g: 1, b: 0.7799999713897705, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Cyan 03',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.5799999833106995, g: 0.9300000071525574, b: 0.9800000190734863, a: 1}, position: 0},
                    {color: {r: 0.41999998688697815, g: 0.3400000035762787, b: 0.9599999785423279, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Cyan 04',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.029999999329447746, g: 0.8899999856948853, b: 1, a: 1}, position: 0},
                    {color: {r: 0.3400000035762787, g: 0.6000000238418579, b: 0.9700000286102295, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [6.123234262925839e-17, -1, 1],
                    [1, 6.123234262925839e-17, 0],
                ],
            },
            {
                name: 'Cyan 05',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.029999999329447746, g: 0.8899999856948853, b: 1, a: 1}, position: 0},
                    {color: {r: 0.3400000035762787, g: 0.6000000238418579, b: 0.9700000286102295, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
            ,
            {
                name: 'Cyan 06',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.029999999329447746, g: 1, b: 0.7200000286102295, a: 1}, position: 0},
                    {color: {r: 0.3400000035762787, g: 0.6000000238418579, b: 0.9700000286102295, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
        ],
    },
    {
        name: 'purple',
        bgColor: '#b280f5',
        paints: [
            {
                name: 'Purple 01',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.7599999904632568, g: 0.2199999988079071, b: 0.800000011920929, a: 1}, position: 0},
                    {color: {r: 0.7099999785423279, g: 0.33000001311302185, b: 0.949999988079071, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Purple 02',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.6499999761581421, g: 0.9100000262260437, b: 1, a: 1}, position: 0},
                    {color: {r: 0.699999988079071, g: 0.5, b: 0.9599999785423279, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
            {
                name: 'Purple 03',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.699999988079071, g: 0.23999999463558197, b: 0.9200000166893005, a: 1}, position: 0},
                    {color: {r: 0.8700000047683716, g: 0.5600000023841858, b: 1, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Purple 04',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.23999999463558197, g: 0.44999998807907104, b: 0.9200000166893005, a: 1}, position: 0},
                    {color: {r: 0.8700000047683716, g: 0.5600000023841858, b: 1, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Purple 05',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.800000011920929, g: 1, b: 0.6499999761581421, a: 1}, position: 0},
                    {color: {r: 0.699999988079071, g: 0.5, b: 0.9599999785423279, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
            {
                name: 'Purple 06',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9510000348091125, g: 0.6499999761581421, b: 1, a: 1}, position: 0},
                    {color: {r: 0.699999988079071, g: 0.5, b: 0.9599999785423279, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
        ],
    },
    {
        name: 'pink',
        bgColor: '#ff9a9e',
        paints: [
            {
                name: 'Pink 01',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 1, g: 0.6039215922355652, b: 0.6196078658103943, a: 1}, position: 0},
                    {color: {r: 0.9803921580314636, g: 0.8156862854957581, b: 0.7686274647712708, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Pink 02',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.6313725709915161, g: 0.5490196347236633, b: 0.8196078538894653, a: 1}, position: 0},
                    {color: {r: 0.9843137264251709, g: 0.7607843279838562, b: 0.9215686321258545, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Pink 03',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9803921580314636, g: 0.8156862854957581, b: 0.7686274647712708, a: 1}, position: 0},
                    {color: {r: 0.9843137264251709, g: 0.7607843279838562, b: 0.9215686321258545, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Pink 04',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.6499999761581421, g: 0.75, b: 1, a: 1}, position: 0},
                    {color: {r: 0.9647058844566345, g: 0.501960813999176, b: 0.5176470875740051, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [6.123234262925839e-17, -1, 1],
                    [1, 6.123234262925839e-17, 0],
                ],
            },
            {
                name: 'Pink 05',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.8500000238418579, g: 0.6499999761581421, b: 1, a: 1}, position: 0},
                    {color: {r: 0.9647058844566345, g: 0.501960813999176, b: 0.5176470875740051, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
            {
                name: 'Pink 06',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 1, g: 0.7440000176429749, b: 0.6000000238418579, a: 1}, position: 0},
                    {color: {r: 0.9916666746139526, g: 0.566076397895813, b: 0.5805032253265381, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [-0.5, 0.8660253882408142, 0.3169873058795929],
                    [-0.8660253882408142, -0.5, 1.1830127239227295],
                ],
            },
        ],
    },
    {
        name: 'light',
        bgColor: '#eeeeee',
        paints: [
            {
                name: 'Light 01',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9541666507720947, g: 0.9541666507720947, b: 0.9541666507720947, a: 1}, position: 0},
                    {color: {r: 0.7699999809265137, g: 0.9399999976158142, b: 0.800000011920929, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Light 02',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9529411792755127, g: 0.9529411792755127, b: 0.9529411792755127, a: 1}, position: 0},
                    {color: {r: 0.9900000095367432, g: 0.7900000214576721, b: 0.800000011920929, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Light 03',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9529411792755127, g: 0.9529411792755127, b: 0.9529411792755127, a: 1}, position: 0},
                    {color: {r: 0.7900000214576721, g: 0.9599999785423279, b: 0.9900000095367432, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Light 04',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9529411792755127, g: 0.9529411792755127, b: 0.9529411792755127, a: 1}, position: 0},
                    {color: {r: 0.9803921580314636, g: 0.8156862854957581, b: 0.7686274647712708, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Light 05',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9529411792755127, g: 0.9529411792755127, b: 0.9529411792755127, a: 1}, position: 0},
                    {color: {r: 0.9800000190734863, g: 0.9200000166893005, b: 0.7599999904632568, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Light 06',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.9529411792755127, g: 0.9529411792755127, b: 0.9529411792755127, a: 1}, position: 0},
                    {color: {r: 0.9100000262260437, g: 0.7799999713897705, b: 0.9800000190734863, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
        ],
    },
    {
        name: 'dark',
        bgColor: '#333333',
        paints: [
            {
                name: 'Dark 01',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.125, g: 0.125, b: 0.125, a: 1}, position: 0},
                    {color: {r: 0.3499999940395355, g: 0.5299999713897705, b: 0.3700000047683716, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Dark 02',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.1666666716337204, g: 0.1666666716337204, b: 0.1666666716337204, a: 1}, position: 0},
                    {color: {r: 0.3700000047683716, g: 0.18000000715255737, b: 0.18000000715255737, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Dark 03',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {
                        color: {r: 0.15833333134651184, g: 0.15833333134651184, b: 0.15833333134651184, a: 1},
                        position: 0,
                    },
                    {color: {r: 0.23000000417232513, g: 0.4300000071525574, b: 0.46000000834465027, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Dark 04',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.1568627506494522, g: 0.1568627506494522, b: 0.1568627506494522, a: 1}, position: 0},
                    {
                        color: {r: 0.49000000953674316, g: 0.38999998569488525, b: 0.36000001430511475, a: 1},
                        position: 1,
                    },
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Dark 05',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.1568627506494522, g: 0.1568627506494522, b: 0.1568627506494522, a: 1}, position: 0},
                    {color: {r: 0.38999998569488525, g: 0.3199999928474426, b: 0.14000000059604645, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
            {
                name: 'Dark 06',
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    {color: {r: 0.1568627506494522, g: 0.1568627506494522, b: 0.1568627506494522, a: 1}, position: 0},
                    {color: {r: 0.4099999964237213, g: 0.2199999988079071, b: 0.5099999904632568, a: 1}, position: 1},
                ],
                gradientTransform: [
                    [0.8660253882408142, -0.5, 0.3169873058795929],
                    [0.5, 0.8660253882408142, -0.1830127090215683],
                ],
            },
        ],
    },
];
