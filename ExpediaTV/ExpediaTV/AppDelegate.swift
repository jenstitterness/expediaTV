//
//  AppDelegate.swift
//  ExpediaTV
//
//  Created by Jens Titterness on 11/30/15.
//  Copyright © 2015 Jens Titterness. All rights reserved.
//

import UIKit
import TVMLKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate {
    
    var window: UIWindow?
    
    var appController: TVApplicationController?
    static let TVBaseURL = "http://localhost:9001/"
    static let TVBootURL = "\(AppDelegate.TVBaseURL)js/application.js"
    
    
    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        
        window = UIWindow(frame: UIScreen.mainScreen().bounds)
        
        // 1
        let appControllerContext = TVApplicationControllerContext()
        
        // 2
        guard let javaScriptURL = NSURL(string: AppDelegate.TVBootURL) else {
            fatalError("unable to create NSURL")
        }
        appControllerContext.javaScriptApplicationURL = javaScriptURL
        appControllerContext.launchOptions["BASEURL"] = AppDelegate.TVBaseURL
        
        // 3
        appController = TVApplicationController(context: appControllerContext, window: window, delegate: self)
        
        // extend splash screen duration
        [NSThread .sleepForTimeInterval(2.0)]
        return true
    }
    
}

