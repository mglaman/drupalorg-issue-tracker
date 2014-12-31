# Drupal Issue Tracker

A Chrome application to provide a simple method for keeping track of Drupal.org project issues.

## Functionality

Take a Drupal.org issue number (the node ID) and add it to the app. It will then utilize Drupal.org's REST APIs and keep
track of the issue. This allows you to keep a collection of important issues and periodically check their status.

## Why?
Managing patches when developing a product is a headache. It can be especially daunting if you're extending upon a suite
of modules (Panopoly, Open Atrium.) You're not only patching contribute projects, but then those other projects as well.

Reading a makefile doesn't exactly highlight all of your patches and their status. Also, if you're building a product, 
you're going to want to track important issues that will affect your development.

## Use it!

Currently this app is not on the Chrome Web Store. To get it running you'll need to load it as an unpacked extension.

* Visit the Extensions page (chrome://extensions/).
* Load unpacked Extension
* Point file browser to /path/to/drupalorg-issue-tracker/app
  * Key is to point to the "app" folder, could do "dist", but "app" is like HEAD
* Launch!

Icons from the [Iconza Circle Social](https://www.iconfinder.com/iconsets/iconza-circle-social) icon set