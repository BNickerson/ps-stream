// ( function ( $ ) {
//     'use strict';
 
//         //***************************
//         // FlexSlider Function
//         //***************************
//         // jQuery('.flexslider').flexslider({
//         //     animation: "slide",
//         //     prevText: "<em class='fa fa-angle-left'></em>",
//         //     nextText: "<em class='fa fa-angle-right'></em>",
//         //     start: function(slider) {
//         //         jQuery('body').removeClass('loading');
//         //     }
//         // });

//         //***************************
//         // Sticky Header Function
//         //***************************
//       jQuery(window).scroll(function() {
//         'use strict';
//           if (jQuery(this).scrollTop() > 170){  
//               jQuery('body').addClass("ec-sticky");
//           }
//           else{
//               jQuery('body').removeClass("ec-sticky");
//           }
//       });

//         //***************************
//         // Click to Top Button
//         //***************************
//         jQuery('.backtop-btn').on("click", function() {
//             jQuery('html, body').animate({
//                 scrollTop: 0
//             }, 800);
//             return false;
//         });

//         //***************************
//         // Countdown Function
//         //***************************
//         jQuery(function() {
//             var austDay = new Date();
//             austDay = new Date(austDay.getFullYear() + 1, 1 - 1, 26);
//             jQuery('#ec-Countdown').countdown({
//                 until: austDay
//             });
//             jQuery('#year').text(austDay.getFullYear());
//         });
//         jQuery(function() {
//             var austDay = new Date();
//             austDay = new Date(austDay.getFullYear() + 1, 1 - 1, 26);
//             jQuery('#ec-Countdowntwo').countdown({
//                 until: austDay
//             });
//             jQuery('#year').text(austDay.getFullYear());
//         });

//         //***************************
//         // PrettyPhoto Function
//         //***************************
//         // jQuery("area[rel^='prettyPhoto']").prettyPhoto();

//         // jQuery(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({
//         //     animation_speed: 'normal',
//         //     theme: 'pp_default',
//         //     social_tools: '',
//         //     slideshow: 3000,
//         //     autoplay_slideshow: true
//         // });
//         // jQuery(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({
//         //     animation_speed: 'fast',
//         //     slideshow: 10000,
//         //     hideflash: true
//         // });

//         // jQuery("#custom_content a[rel^='prettyPhoto']:first").prettyPhoto({
//         //     custom_markup: '<div id="map_canvas" style="width:260px; height:265px"></div>',
//         //     changepicturecallback: function() {
//         //         initialize();
//         //     }
//         // });

//         // jQuery("#custom_content a[rel^='prettyPhoto']:last").prettyPhoto({
//         //     custom_markup: '<div id="bsap_1259344" class="bsarocks bsap_d49a0984d0f377271ccbf01a33f2b6d6"></div><div id="bsap_1237859" class="bsarocks bsap_d49a0984d0f377271ccbf01a33f2b6d6" style="height:260px"></div><div id="bsap_1251710" class="bsarocks bsap_d49a0984d0f377271ccbf01a33f2b6d6"></div>',
//         //     changepicturecallback: function() {
//         //         _bsap.exec();
//         //     }
//         // });
        
//         //***************************
//         // SearchToggle Function
//         //***************************
//         jQuery('.ec-search-popup-btn').on("click", function(){
//             jQuery('.ec-search-popup').fadeToggle('');
//             return false;
//         });
//         //***************************
//         // CartToggle Function
//         //***************************
//         jQuery('a.ec-cartbtn').on("click", function(){
//             jQuery('.ec-cart-box').slideToggle('slow');
//             return false;
//         });
//         jQuery('html').on("click", function() { jQuery(".ec-cart-box").fadeOut(); });
//         jQuery('.ec-navicons,.ec-cartsection').on("click", function(event){ event.stopPropagation(); });
//         //***************************
//         // LoginToggleClass Function
//         //***************************
//         jQuery('.ec-modallogin-form p a').on("click", function(){
//             jQuery('.modal-body').toggleClass('ec-login-toggle');
//             return false;
//         });

//         //***************************
//         // Responsive Video Function
//         //***************************
//         jQuery(".ec-main-content").fitVids();

//         //***************************
//         // Responsive Menu Function
//         //***************************
//         jQuery(function() {
//             jQuery('#as-menu').asmenu();
//         });

//         //***************************
//         // WordCounter Function
//         //***************************
//         jQuery(".word-count").counterUp({
//             delay: 10,
//             time: 1000
//         });

//         //***************************
//         // Skills Function
//         //***************************
//         jQuery('.skillbar').each(function() {
//             jQuery(this).appear(function() {
//                 jQuery(this).find('.count-bar').animate({
//                     width:jQuery(this).attr('data-percent')
//                 },3000);
//                 var percent = jQuery(this).attr('data-percent');
//                 jQuery(this).find('.count').html('<span>' + percent + '</span>');
//             });
//         }); 

// } ( jQuery ) )


// //***************************
// // Parallax Function
// //***************************
// function fullscreenFix(){var a=$("body").height();$(".content-b").each(function(){$(this).innerHeight()<=a&&$(this).closest(".fullscreen").addClass("not-overflow")})}function backgroundResize(){var a=$(window).height();$(".background").each(function(){var i=$(this),t=i.width(),e=i.height(),s=i.attr("data-img-width"),o=i.attr("data-img-height"),n=s/o,r=parseFloat(i.attr("data-diff"));r=r?r:0;var c=0;if(i.hasClass("parallax")&&!$("html").hasClass("touch")){c=a-e}o=e+c+r,s=o*n,t>s&&(s=t,o=s/n),i.data("resized-imgW",s),i.data("resized-imgH",o),i.css("background-size",s+"px "+o+"px")})}function parallaxPosition(){var a=$(window).height(),i=$(window).scrollTop(),t=i+a,e=(i+t)/2;$(".parallax").each(function(){var s=$(this),o=s.height(),n=s.offset().top,r=n+o;if(t>n&&r>i){var c=(s.data("resized-imgW"),s.data("resized-imgH")),l=0,d=-c+a,h=a>o?c-o:c-a;n-=h,r+=h;var u=l+(d-l)*(e-n)/(r-n),g=s.attr("data-oriz-pos");g=g?g:"50%",$(this).css("background-position",g+" "+u+"px")}})}"ontouchstart"in window&&(document.documentElement.className=document.documentElement.className+" touch"),$("html").hasClass("touch")||$(".parallax").css("background-attachment","fixed"),$(window).resize(fullscreenFix),fullscreenFix(),$(window).resize(backgroundResize),$(window).focus(backgroundResize),backgroundResize(),$("html").hasClass("touch")||($(window).resize(parallaxPosition),$(window).scroll(parallaxPosition),parallaxPosition());


// jQuery(window).load(function(){jQuery(".ec-loading-section").fadeOut("slow");});