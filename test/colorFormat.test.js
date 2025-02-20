import {
    selectFormat,

    hexNumToHexNumString,
    hexNumToHexString,
    hexNumToRgbString,
    hexNumToRgbInt,
    hexNumToRgbfloat,
    hexNumToRgbVector,
    hexNumToHsl,
    hexNumToHsv,
    hexNumToHsb,
} from "../src/Library/colorFormats.js";


const testNumbers = [
    0x000000,
    0x0000ff,
    0x00ff00,
    0xff0000,
    0xffffff,
    0x753530,
    0x8549de,
    0x8fbda6,
    0x9c998e,
    0x030b54,
    0xab0f51,
]

const myTests = [ 
    {
        run:true,
        log:false,
        name:'Hexidecimal Number',
        fn:hexNumToHexNumString,
        ans: [
            "0x000000",
            "0x0000ff",
            "0x00ff00",
            "0xff0000",
            "0xffffff",
            "0x753530",
            "0x8549de",
            "0x8fbda6",
            "0x9c998e",
            "0x030b54",
            "0xab0f51",
        ],
    },{
        run:true,
        log:false,
        name:'Hexidecimal String',
        fn:hexNumToHexString,
        ans:[
            "#000000",
            "#0000ff",
            "#00ff00",
            "#ff0000",
            "#ffffff",
            "#753530",
            "#8549de",
            "#8fbda6",
            "#9c998e",
            "#030b54",
            "#ab0f51",
        ],
    },{
        run:true,
        log:false,
        name:'RGB String',
        fn:hexNumToRgbString,
        ans:[
            "rgb(0, 0, 0)",
            "rgb(0, 0, 255)",
            "rgb(0, 255, 0)",
            "rgb(255, 0, 0)",
            "rgb(255, 255, 255)",
            "rgb(117, 53, 48)",
            "rgb(133, 73, 222)",
            "rgb(143, 189, 166)",
            "rgb(156, 153, 142)",
            "rgb(3, 11, 84)",
            "rgb(171, 15, 81)",
        ],
    },{
        run:true,
        log:false,
        name:'RGB int',
        fn:hexNumToRgbInt,
        ans:[
            "[0, 0, 0]",
            "[0, 0, 255]",
            "[0, 255, 0]",
            "[255, 0, 0]",
            "[255, 255, 255]",
            "[117, 53, 48]",
            "[133, 73, 222]",
            "[143, 189, 166]",
            "[156, 153, 142]",
            "[3, 11, 84]",
            "[171, 15, 81]",
        ],
    },{
        run:true,
        log:false,
        name:'RGB float',
        fn:hexNumToRgbfloat,
        ans:[
            "[0.0, 0.0, 0.0]",
            "[0.0, 0.0, 1.0]",
            "[0.0, 1.0, 0.0]",
            "[1.0, 0.0, 0.0]",
            "[1.0, 1.0, 1.0]",
            "[0.458824, 0.207843, 0.188235]",
            "[0.521569, 0.286275, 0.870588]",
            "[0.560784, 0.741176, 0.65098]",
            "[0.611765, 0.6, 0.556863]",
            "[0.011765, 0.043137, 0.329412]",
            "[0.670588, 0.058824, 0.317647]",
        ]
    },{
        run:true,
        log:false,
        name:'RGB Vector',
        fn:hexNumToRgbVector,
        ans:[
            "vec3(0.0, 0.0, 0.0);",
            "vec3(0.0, 0.0, 1.0);",
            "vec3(0.0, 1.0, 0.0);",
            "vec3(1.0, 0.0, 0.0);",
            "vec3(1.0, 1.0, 1.0);",
            "vec3(0.458824, 0.207843, 0.188235);",
            "vec3(0.521569, 0.286275, 0.870588);",
            "vec3(0.560784, 0.741176, 0.65098);",
            "vec3(0.611765, 0.6, 0.556863);",
            "vec3(0.011765, 0.043137, 0.329412);",
            "vec3(0.670588, 0.058824, 0.317647);",
        ]
    },{
        run:true,
        log:false,
        name:'HSL',
        fn:hexNumToHsl,
        ans:[
            "hsl(0°, 0%, 0%)",
            "hsl(240°, 100%, 50%)",
            "hsl(120°, 100%, 50%)",
            "hsl(0°, 100%, 50%)",
            "hsl(0°, 0%, 100%)",
            "hsl(4°, 42%, 32%)",
            "hsl(264°, 69%, 58%)",
            "hsl(150°, 26%, 65%)",
            "hsl(47°, 7%, 58%)",
            "hsl(234°, 93%, 17%)",
            "hsl(335°, 84%, 36%)",
        ]
    },{
        run:true,
        log:false,
        name:'HSV',
        fn:hexNumToHsv,
        ans:[
            "hsv(0°, 0%, 0%)",
            "hsv(240°, 100%, 100%)",
            "hsv(120°, 100%, 100%)",
            "hsv(0°, 100%, 100%)",
            "hsv(0°, 0%, 100%)",
            "hsv(4°, 59%, 46%)",
            "hsv(264°, 67%, 87%)",
            "hsv(150°, 24%, 74%)",
            "hsv(47°, 9%, 61%)",
            "hsv(234°, 96%, 33%)",
            "hsv(335°, 91%, 67%)",
        ]
    },{
        run:true,
        log:false,
        name:'HSB',
        fn:hexNumToHsb,
        ans:[
            "hsb(0°, 0%, 0%)",
            "hsb(240°, 100%, 100%)",
            "hsb(120°, 100%, 100%)",
            "hsb(0°, 100%, 100%)",
            "hsb(0°, 0%, 100%)",
            "hsb(4°, 59%, 46%)",
            "hsb(264°, 67%, 87%)",
            "hsb(150°, 24%, 74%)",
            "hsb(47°, 9%, 61%)",
            "hsb(234°, 96%, 33%)",
            "hsb(335°, 91%, 67%)",
        ]
    },
]


describe('color formats', () => {
    //test
    for(let i = 0; i < myTests.length; i++ ){
        const currTest = myTests[i]
        if(!currTest.run) continue;
        test(currTest.name, () => {
            const sample = Array(testNumbers.length)
            for(let i = 0; i <sample.length; i++ ){
                sample[i] = currTest.fn(testNumbers[i])
            }
            if(currTest.log) console.log(sample, currTest.ans);
            expect(sample).toEqual(currTest.ans);
        });
    }
    //format
    for(let i = 0; i < myTests.length; i++ ){
        const currTest = myTests[i]
        if(!currTest.run) continue;
        test(currTest.name + "format", () => {
            const sample = Array(testNumbers.length)
            const fn = selectFormat(currTest.name)
            for(let i = 0; i <sample.length; i++ ){
                sample[i] = fn(testNumbers[i])
            }
            if(currTest.log) console.log(sample, currTest.ans);
            expect(sample).toEqual(currTest.ans);
        });
    }
});