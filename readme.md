Note: Don't use it in production, this is super experimental.


# Porting react to react-native made simple
Just use our dropin replacement for styled-components and localstorage



# How it works
It encapluates react-native api in a way that makes it behave as web API. So, things
like onClick, dataset, target.value will work out of the box.

# Benefits
* With react-native you can't have text inside view but with this package you can
Just use styled.div
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

* Copy react code to react-native project folder.
* replace styled-components import line with portable-components import 

```
npm i portable-components
```

```
import {styled,localStorage} from "portable-components"
```


If you are not using any third party react library then everything might work as
expected otherwise you will have to replace react libraries with react-native
alternative 

Note: Handle localstorage in a asynchronous way