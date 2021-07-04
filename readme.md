# Porting react to react-native made simple
Just use our dropin replacement for styled-components and localstorage

Note: Handle localstorage in a asynchronous way

# How it works
It detects which platform it is running on. If it is react-native, react-native modules are
used otherwise borswer apis are used. for example div is used on web and View is used on react-native.
It also adds support for dataset, onClick

# caveats
* If you are not already using styled-components this project won't be useful to you, first switch to styled-compoents to make use of this package
* Not yet tested on MAC / IOS
* This project is very infant
* This package is in prototyping stage, things can change
* .attr feature of styled components are not supported yet
* only common styled-component components are supported like
    * div/View
    * span/Text
    * button
    * h1
    * h2
    * h3
    * h4
    * h5
    * h6