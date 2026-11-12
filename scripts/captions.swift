// Burns the storyboard captions (build/video/capN.png, 1080x1920 transparent) into the intro video.
// usage: captions <in.mp4> <out.mp4>   — timings below (seconds)
import AVFoundation
import AppKit
import QuartzCore

let CAPS: [(String, Double, Double)] = [
  ("build/video/cap1.png", 0.4, 5.6),   // berry in the jungle
  ("build/video/cap2.png", 6.0, 11.4),  // berries fall into the cup
  ("build/video/cap3.png", 11.8, 16.4), // toppings fall
  ("build/video/cap4.png", 16.8, 21.0), // finished bowl
  ("build/video/cap5.png", 21.4, 26.9), // closing: logo + claim
]
// always-on overlays (no fade), e.g. the brand symbol in the top-left corner
let STATIC = ["build/video/symbol.png"]
let FADE = 0.45
let args = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let out = URL(fileURLWithPath: args[2]); try? FileManager.default.removeItem(at: out)
let sem = DispatchSemaphore(value: 0)

Task {
  let comp = AVMutableComposition()
  let dur = try await asset.load(.duration)
  let range = CMTimeRange(start: .zero, duration: dur)
  let vSrc = try await asset.loadTracks(withMediaType: .video)[0]
  let vT = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
  try vT.insertTimeRange(range, of: vSrc, at: .zero)
  if let aSrc = try await asset.loadTracks(withMediaType: .audio).first {
    let aT = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
    try aT.insertTimeRange(range, of: aSrc, at: .zero)
  }
  let size = CGSize(width: 1080, height: 1920)
  let fps = try await vSrc.load(.nominalFrameRate)
  let parent = CALayer(); parent.frame = CGRect(origin: .zero, size: size)
  let video = CALayer(); video.frame = parent.frame; parent.addSublayer(video)
  for (path, t0, t1) in CAPS {
    let img = NSImage(contentsOfFile: path)!.cgImage(forProposedRect: nil, context: nil, hints: nil)!
    let l = CALayer(); l.frame = parent.frame; l.contents = img; l.opacity = 0
    let a = CAKeyframeAnimation(keyPath: "opacity")
    a.values = [0, 1, 1, 0]
    a.keyTimes = [0, NSNumber(value: FADE / (t1 - t0)), NSNumber(value: 1 - FADE / (t1 - t0)), 1]
    a.beginTime = AVCoreAnimationBeginTimeAtZero + t0
    a.duration = t1 - t0; a.isRemovedOnCompletion = false; a.fillMode = .both
    // slight rise-in for the caption
    let m = CAKeyframeAnimation(keyPath: "position.y")
    let y = l.position.y
    m.values = [y - 24, y, y]; m.keyTimes = [0, NSNumber(value: (FADE * 1.6) / (t1 - t0)), 1]
    m.beginTime = a.beginTime; m.duration = a.duration; m.isRemovedOnCompletion = false; m.fillMode = .both
    m.timingFunctions = [CAMediaTimingFunction(name: .easeOut), CAMediaTimingFunction(name: .linear)]
    l.add(a, forKey: "o"); l.add(m, forKey: "m")
    parent.addSublayer(l)
  }
  for path in STATIC {
    let l = CALayer(); l.frame = parent.frame
    l.contents = NSImage(contentsOfFile: path)!.cgImage(forProposedRect: nil, context: nil, hints: nil)!
    parent.addSublayer(l)
  }
  parent.isGeometryFlipped = true
  let vc = AVMutableVideoComposition()
  vc.renderSize = size
  vc.frameDuration = CMTime(value: 1, timescale: CMTimeScale(fps.rounded() > 0 ? fps.rounded() : 30))
  let ins = AVMutableVideoCompositionInstruction(); ins.timeRange = range
  let li = AVMutableVideoCompositionLayerInstruction(assetTrack: vT)
  li.setTransform(try await vSrc.load(.preferredTransform), at: .zero)
  ins.layerInstructions = [li]; vc.instructions = [ins]
  vc.animationTool = AVVideoCompositionCoreAnimationTool(postProcessingAsVideoLayer: video, in: parent)
  let ex = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetHighestQuality)!
  ex.videoComposition = vc; ex.outputURL = out; ex.outputFileType = .mp4; ex.shouldOptimizeForNetworkUse = true
  await ex.export()
  print(ex.status == .completed ? "ok \(args[2])" : "FAILED \(String(describing: ex.error))")
  sem.signal()
}
sem.wait()
