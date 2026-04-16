# [every-color.com](https://every-color.com)

A website for exploring every possible 24-bit RGB color.

## Color Formats

The site supports multiple color representations:

- Hexidecimal Number `0xff00ff`
- Hexidecimal String `#ff00ff`
- RGB String `rgb(255, 87, 51)`
- RGB int `[255,0,255]`
- RGB Float `[1.0,0.123213,1.0]`
- RGB Vector `vec3(1.0,0.123213,1.0);`
- HSL `hsl(14, 100%, 60%)`
- HSV `hsv(14, 80%, 100%)`
- HSB `hsb(14, 80%, 100%)`
- Index `16777215`

## Color Ordering

### Gradient Order

Colors are reordered using a bijective mapping that places visually similar colors near one another, producing a smooth and continuous gradient while scrolling.

### Numeric Order

In the default view, colors are displayed in numeric order from `0` to `16,777,215`. This ordering creates abrupt transitions between colors due to the structure of RGB color space.

## Vision Options

The site includes simulations for different types of color vision:

- Default
- Protanopia
- Deuteranopia
- Tritanopia
- Monochromacy
