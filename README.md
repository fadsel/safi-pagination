# Safi Pagination
An Async Pagination Tool Built Initially built to support Ajax Calls for Codeigniter, But then it turn out to this


### UI Blocker Setup
This sets up the Easiest way to block the user from interacting with your UI while **Safi Pagination** works the magic behind changing your content. 

The library gives you freedom of where you would want to put the **UI Blocker** while pagination during the preloader like how [SafiCloud!](https://saficloud.com) boots.

```html
<div class="page-overlay" style="display:none;">

    <div class="indicator">
        <svg width="16px" height="12px">
        <polyline id="back" points="1 6 4 6 6 11 10 1 12 6 15 6"></polyline>
        <polyline id="front" points="1 6 4 6 6 11 10 1 12 6 15 6"></polyline>
        </svg>
    </div>

</div>
```

### Installation
First you need to have an element tag to call **Safi Pagination**
Just add 
```<safi></safi>```
anywhere in the page. In an occasional where you would like to add multiple instances of the plugin use ```safi-*```
The plugin search the whole page and read all elements containing the **safi** or _safi-<any-word>__ keyword
  
```javascript
<safi></safi>
<script src="/assets/js/safi-pagination.js" type="text/javascript"></script>
<script>
    document.addEventListener("DOMContentLoaded", function(event) {
        $("safi").SafiPagination({
            content_container: ".product-type-change", // Where the plugin will start to crawl
            page_overlay_container: ".page-overlay", //The div where it holds the CSS preloader
            pagination_container: ".ci-pagination", //The div where CI echos its div with pagination links

            //for delaying the loading
            loading_delay: 300,
            debug: true, // If you want to show the debug information
            scrollToTopAfterClick:false,
            scrollElementID:"top",
            after_pagination_callback:null // A Callback to be called after every paginaion, great for initializing other js libraries
        });

    });
</script>
```

Adding that code above will get you started right away, but to get the most of it, try adding some styles to the **preloader** and the **UI Blocker**

### The CSS Style for Preloader
Ther are other svg preloaders you could choose from here, For the sake of this example we chose the **dash** preloader
```
.page-overlay{
    top: 0;
    left: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1001;
    display: block;
    background:rgba(255,255,255,0.6);
}

.indicator {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%) scale(5);
}
.indicator svg polyline {
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}
.indicator svg polyline#back {
    stroke: rgba(204, 211, 207, 0.30);
}
.indicator svg polyline#front {
    stroke: #c1cfd3;
    stroke-dasharray: 12, 36;
    stroke-dashoffset: 48;
    animation: dash 1s linear infinite;
}

@-moz-keyframes dash {
    62.5% {
        opacity: 0;
    }
    to {
        stroke-dashoffset: 0;
    }
}
@-webkit-keyframes dash {
    62.5% {
        opacity: 0;
    }
    to {
        stroke-dashoffset: 0;
    }
}
@-o-keyframes dash {
    62.5% {
        opacity: 0;
    }
    to {
        stroke-dashoffset: 0;
    }
}
@keyframes dash {
    62.5% {
        opacity: 0;
    }
    to {
        stroke-dashoffset: 0;
    }
}
```

## API Details
1. Reload Content (Default)
```
$safi.SafiPagination("reloadContents");
```

2. Reload Specific URL Contents with Changing Parts
```
$safi.SafiPagination("reloadURLContents",[
    ".total-sales-div",
    ".report-title",
    ".filter-applied-warning",
    ".side-options",
    ".category"
]);
```

3. Reload a Specific URL with Callback
```
$safi.SafiPagination("reloadContentsWithCallback",[
    ".total-sales-div",
    ".report-title",
    ".filter-applied-warning",
    ".side-options",
    ".category"
],function(){
// when it finishes, do this ...
console.log("Loading Stuff ...");
});
```


# Disclaimer

# License
