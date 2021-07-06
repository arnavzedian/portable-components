# Porting react to react-native made simple
Just use our dropin replacement for styled-components and localstorage

Note: Handle localstorage in a asynchronous way

# How it works
It emulates web api while using native api to support things like: dataset, vw, eventObject. 
so that you have to make least amount of changes for porting to react-native.

# Benefits
* with react-native you can't have text inside view but with this package you can
Just use styled.div. under the hood it automatically detect if children is string or not 
and depending on that it renders the approprivate native component 
* It support onClick and event object has the same format
* it supports dataset
* It suports vw, vh, vmin, vmax without making any changes

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


# usage

* First copy the source of of reactApp into the react-native project folder
* remove all br tags
* remove all tags that are not using styled-components
* Install portable-components
```
npm i portable-components
```
* replace all the styled-components import with the following line
```
import {styled,localStorage} from "portable-components"
```

and hope fully everything should work but depending on the project you 
might have to make additional changes