ObjC.import('CoreImage');
ObjC.import('AppKit');
ObjC.import('Foundation');

function run(argv) {
    const inputPath = argv[0];
    const outputPath = argv[1];
    
    const inputUrl = $.NSURL.fileURLWithPath(inputPath);
    const inputImage = $.CIImage.imageWithContentsOfURL(inputUrl);
    
    if (!inputImage) {
        console.log("Failed to load input image: " + inputPath);
        return;
    }
    
    var current = inputImage;
    
    // 1. Temperature & Tint adjustment (warm golden amber)
    // Neutral is 6500K. Target neutral: 5700K (warms image) and -10 tint (shifts magenta away toward green/warmth)
    var tempFilter = $.CIFilter.filterWithName("CITemperatureAndTint");
    tempFilter.setValueForKey(current, "inputImage");
    tempFilter.setValueForKey($.CIVector.vectorWithXY(6500, 0), "inputNeutral");
    tempFilter.setValueForKey($.CIVector.vectorWithXY(5700, -8), "inputTargetNeutral");
    current = tempFilter.valueForKey("outputImage");
    
    // 2. Color Controls (tune saturation slightly down from neon red, boost contrast for crispness)
    var colorFilter = $.CIFilter.filterWithName("CIColorControls");
    colorFilter.setValueForKey(current, "inputImage");
    colorFilter.setValueForKey(0.92, "inputSaturation"); // reduce oversaturated red
    colorFilter.setValueForKey(1.08, "inputContrast");   // punchy contrast
    colorFilter.setValueForKey(0.01, "inputBrightness"); // slight lift
    current = colorFilter.valueForKey("outputImage");
    
    // 3. Vibrance to keep the crispy batter golden and parsley green without blowing red
    var vibFilter = $.CIFilter.filterWithName("CIVibrance");
    vibFilter.setValueForKey(current, "inputImage");
    vibFilter.setValueForKey(0.18, "inputAmount");
    current = vibFilter.valueForKey("outputImage");
    
    // 4. Unsharp Mask (crisp sesame seeds, crispy batter texture)
    var sharpFilter = $.CIFilter.filterWithName("CIUnsharpMask");
    sharpFilter.setValueForKey(current, "inputImage");
    sharpFilter.setValueForKey(2.2, "inputRadius");
    sharpFilter.setValueForKey(0.85, "inputIntensity");
    current = sharpFilter.valueForKey("outputImage");
    
    // Render to CGImage & JPEG
    var context = $.CIContext.contextWithOptions(null);
    var extent = current.extent;
    var cgImage = context.createCGImageFromRect(current, extent);
    
    var bitmapRep = $.NSBitmapImageRep.alloc.initWithCGImage(cgImage);
    var props = $.NSDictionary.dictionaryWithObjectForKey(0.92, $.NSImageCompressionFactor);
    var jpegData = bitmapRep.representationUsingTypeProperties($.NSJPEGFileType, props);
    
    var outputUrl = $.NSURL.fileURLWithPath(outputPath);
    jpegData.writeToURLAtomically(outputUrl, true);
    
    console.log("SUCCESS: Image written to " + outputPath);
}
