![Pugs](pugs.webp)

# pugsharp

***It's not just [sharp](https://www.npmjs.com/package/sharp), it's pugsharp!***

Batch resize and reformat images for your [Pug](https://www.npmjs.com/package/pug) project.

## About
The [pughsarp Node.js module](https://www.npmjs.com/package/pugsharp) is evolving, based on the specifications of the fictional Pug Image Transormer (PIT). For more details, visit [PIT's GitHub Repository](https://github.com/sebfried/pit).

## How to use the Module
If you have not already done so, [download and install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

1. Navigate to your image directory.
2. Create and configure a `pugsharp.json` config file.
3. Run `npx pugsharp` in the console.

Watch the magic happen.

## Config Files
Put a `pugsharp.json` config file in your image directory, right next to the images.

Each image will have it's own directory, based on the image name. That's where the generated images will be. 

### Minimal Configuration
Below is the minimal required configuration for an image in the `pugsharp.json` file.

```json
[
    {
        "img": "pug.png",
        "format": ["jpg"],
        "from": 100,
        "to": 1200,
        "step": 300
    }
]
```

### Extended Configuration
```json
[
    {
        "img": "pug.png",
        "format": ["jpg"],
        "from": 100,
        "to": 1200,
        "step": 300,
        "sharp-jpeg": {
            "mozjpeg": true,
            "quality": 80
        }
    },
    {
        "img": "pug2.avif",
        "format": ["webp","avif"],
        "from": 300,
        "to": 2000,
        "step": 100,
        "lazy": false,
        "data-src": true,
        "sharp-webp": {
            "quality": 80,
            "effort": 5
        },
        "sharp-avif": {
            "quality": 70,
            "effort": 7
        }
    }
]
```
### Config keys
`"img"`: File name of the image.  
`"format"`: Target image format array.  
`"from"`: Smallest target image size.  
`"to"`: Largest target image size.  
`"step"`: Pixel step size between small and large.  
`"lazy"`: If false, *`loading="lazy"`* won't be applied to the img element. Default is `true`.  
`"data-src"`: If true, you'll get *`<img data-src="...">`*, instead of *`<img src="...">`*. Same for *`<source srcset>`*.   
`"sharp-*"`: For detailed format options, see the [sharp format documentation](https://sharp.pixelplumbing.com/api-output#toformat).

## Pug Mixins
As a bonus, pugsharp generates a Pug mixin template for each processed image, further simplifying the integration of responsive images into your Pug projects.

### How to use the Pug Mixins
Within the directory of any processed image, you'll find a complementary `.pug` file, containing a ready-to-use mixin. This mixin enables easy integration of the generated images. 

Simply include the `.pug` file and call the mixin, providing the image path and alt text as parameters. 

```
//- Example
include /img/imagename/imagename.pug
+img("/img/imagename/imagename-1000.jpg", "pug image")
```

### Sample HTML Output
Here's how the Pug mixin translates into HTML output:
```html
<picture>
    <source srcset="/img/pug/pug-1000.jpg 1000w, /img/pug/pug-2000.jpg 2000w" type="image/jpg">
    <source srcset="/img/pug/pug-1000.avif 1000w, /img/pug/pug-2000.avif 2000w" type="image/avif">
    <img src="/img/pug/pug-1000.jpg" alt="pug image" loading="lazy">
</picture>
```
