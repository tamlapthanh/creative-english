
var JSON_DATA;
const SELECTOR_SIDEBAR_WRAPPER = ".sidebar-wrapper";
const Default = {
    scrollbarTheme: "os-theme-light",
    scrollbarAutoHide: "leave",
    scrollbarClickScroll: true,
};
document.addEventListener("DOMContentLoaded", function () {
    const sidebarWrapper = document.querySelector(SELECTOR_SIDEBAR_WRAPPER);
    if (
        sidebarWrapper &&
        typeof OverlayScrollbarsGlobal?.OverlayScrollbars !== "undefined"
    ) {
        OverlayScrollbarsGlobal.OverlayScrollbars(sidebarWrapper, {
            scrollbars: {
                theme: Default.scrollbarTheme,
                autoHide: Default.scrollbarAutoHide,
                clickScroll: Default.scrollbarClickScroll,
            },
        });
    }
});

function loadDataToDiv(json_data, tagName, data_type) {
    moment.locale("vi");
    $("div").remove(".video");
    $(".spinner-grow").show();
    jQuery(json_data).each(function (index, item) {
        var appendTag = "";
        if (item.Full_Path.includes(data_type)) {
            if (item.Type.includes("mp4") || item.Type.includes("jpg")) {
                var learn_day = moment(item.Updated).format('llll');
                var tooltip = item.Description;
                var content = item.Description != "NULL" ? item.Description : learn_day;
                var video_id = `https://drive.google.com/file/d/${item.ID}/preview`;
                var thumbnail_id = `https://drive.google.com/thumbnail?id=${item.ID}`;
                var background = "bg-warning";
                if (item.Type.includes("jpg")) {
                    background = "bg-info";
                }

                appendTag = `<div class="col-6 col-sm-6 col-md-2 video"   data-video="${video_id}" data-toggle="modal" data-target="#videoModal" >
                                                <span class="d-none d-lg-block ${background} ">${content}</span>
                                                <div class="info-box text-bg-primary" style="background-image: url('${thumbnail_id}'); background-size: cover; cursor: pointer;"> 
                                                    <div class="info-box-content" style="min-height: 200px;"> 
                                                        <span class="info-box-text d-block d-lg-none label  label-primary">${content}</span> 
                                                    </div> <!-- /.info-box-content -->
                                                </div> <!-- /.info-box -->
                                            </div> <!-- /.col -->`;

                $(tagName).append(appendTag);
            } // end of if
        }
    }); // end of   jQuery

    $(".spinner-grow").hide();
} // end of function loadData

$(function () {

    $('.menu_class, .item_menu_class').click(function () {

        $('.item_menu_class').removeClass("active");
        $('.menu_class').removeClass("active");
        $(this).addClass("active");

        if ($(this).hasClass('item_menu_class')) {
            // Disable all buttons
            $('.item_menu_class').removeClass("text-primary");
            // Enable the clicked button
            $(this).addClass("text-primary");
        }


        var ref_data = $(this).attr('ref_data');
        loadDataToDiv(JSON_DATA, ".data_class", ref_data);
    });

    function isMobile() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      }

      
    $(document).on("click", ".video", function () {
       // console.log(this);
        var theModal = $(this).data("target"),
            videoSRC = $(this).attr("data-video"),
            videoSRCauto = videoSRC
        $(theModal + ' iframe').attr('src', videoSRCauto);
        $(theModal + ' button.close').click(function () {
            $(theModal + ' iframe').attr('src', videoSRC);
        });

        if (isMobile()) { // Nếu là thiết bị di động
            const screenWidth = $(window).width();    // Lấy chiều rộng màn hình
            const screenHeight = $(window).height();  // Lấy chiều cao màn hình
          
            // Cập nhật nguồn và kích thước iframe
            $(theModal + ' iframe').css('width', (screenWidth * 0.90)+ 'px');
            $(theModal + ' iframe').css('height', (screenHeight * 0.8) + 'px');
        }
  
    });


    getDataFromGoogleSheet();

}); // end of $(function() {

/*
async function getDataFromGoogleSheet() {
$( ".spinner-grow" ).show();
var url = "https://script.google.com/macros/s/AKfycbw6wLxFkPaRkuiiMykkNXnbha8caeXgCpFSUdpKDzfupkuWVE8qJrazbosQckpSm2Ctiw/exec";
const response = await fetch(
url + "?name=Sheet1"
);
//   console.log(response);
JSON_DATA  = await response.json();
$( ".spinner-grow" ).hide();
loadDataToDiv(JSON_DATA, ".data_class",  "bai_hoc");
}
*/

async function getDataFromGoogleSheet() {
    console.log("getDataFromGoogleSheet::start");
    $(".spinner-grow").show();

    const url = "https://script.google.com/macros/s/AKfycbw6wLxFkPaRkuiiMykkNXnbha8caeXgCpFSUdpKDzfupkuWVE8qJrazbosQckpSm2Ctiw/exec?name=Sheet1";
    const response = await fetch(url);
    JSON_DATA = await response.json();

    console.log("getDataFromGoogleSheet::end");
    $(".spinner-grow").hide();
    loadDataToDiv(JSON_DATA, ".data_class", "bai_hoc");
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
    });
}