// usage: convert <in.png> <out> <jpg|png|pnga>
import AppKit
let a = CommandLine.arguments
let src = NSImage(contentsOfFile: a[1])!.cgImage(forProposedRect: nil, context: nil, hints: nil)!
let w = src.width, h = src.height, mode = a[3]
let alpha = mode == "pnga"
let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0,
  space: CGColorSpace(name: CGColorSpace.sRGB)!,
  bitmapInfo: alpha ? CGImageAlphaInfo.premultipliedLast.rawValue : CGImageAlphaInfo.noneSkipLast.rawValue)!
if !alpha { ctx.setFillColor(CGColor(red: 0.16, green: 0.06, blue: 0.25, alpha: 1)); ctx.fill(CGRect(x: 0, y: 0, width: w, height: h)) }
ctx.draw(src, in: CGRect(x: 0, y: 0, width: w, height: h))
let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
let data = mode == "jpg" ? rep.representation(using: .jpeg, properties: [.compressionFactor: 0.92])!
                         : rep.representation(using: .png, properties: [:])!
try! data.write(to: URL(fileURLWithPath: a[2]))
