var to_name;
var to_vicinity;
var to_lat;
var to_long;

function initMap() {} // now it IS a function and it is in global


$(document).ready(function () {
    
    $(() => {
      initMap = function() {
          
        // put your jQuery code here
        var country = 'ke';
        var options = {componentRestrictions: {country: country}};
        var autocomplete = new google.maps.places.Autocomplete($("#api_to")[0], options);

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            to_name = place.name;
            to_vicinity = place.vicinity;
            to_lat = place.geometry.location.lat();
            to_long = place.geometry.location.lng();
            sendRequest(to_name, to_lat, to_long);
            getLink();
        });
        
      }
    });

    function sendRequest(to_name, to_lat, to_long) {
        var to_name = to_name;
        var to_lat = to_lat;
        var to_long = to_long;
        var url = "/modules/sendyapimodule/custom/dataReceiver.php";
        url = getLink(url);
        $.ajax({
            type: "POST",
            url: url,
            data: {
                to_name: to_name,
                to_lat: to_lat,
                to_long: to_long
            },
            beforeSend: function () {
                $('.loader').show();
                $("#submitBtn").css("background-color", "grey");
                $("#submitBtn").val('PRICING...');
            },
            success: function (res) {
                console.log(res);
                 let data = JSON.parse(res);
                 let price = data.data.amount;
                $('.loader').hide();
                $('.divHidden').show();
                $(".show-price").text(price);
                $("#submitBtn").css("display", "none");
            }
        })
            .fail(function (er) {
                console.log(er);
                $('.loader').hide();
            })
    }

    function getLink(url) {
        var loc = window.location.pathname;
        var dir = loc.substring(0, loc.lastIndexOf('/'));
        console.log(dir+url);
        return dir+url;
    }
});
