/**

 * NOTICE OF LICENSE

 *

 * This file is licenced under the Software License Agreement.

 * With the purchase or the installation of the software in your application

 * you accept the licence agreement.

 *

 * You must not modify, adapt or create derivative works of this source code

 *

 *  @author    Dervine N

 *  @copyright Sendy Limited

 *  @license   LICENSE.txt

 */

var to_name;
var to_vicinity;
var to_lat;
var to_long;

function initMap() {} // now it IS a function and it is in global


$(document).ready(function () {
    
    $(() => {
      initMap = function() {
        console.log("initiliazing maps");
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

    setPhoneRequired();

    function setPhoneRequired() {
        console.log('making phone required');
        $('input[name=phone]').prop('required',true);
        $('input[name=phone]').parents(".form-group").find(".form-control-comment").html('');
    }

    function setDeliveryMessage() {
        $('label[for=delivery_message]').html('Include more information i.e (building, room) or extra details about your order below.');
        $('#delivery_message').attr("placeholder", "Max 300 characters");
        $('#delivery_message').css("font-size", "12px");
        $('#delivery_message').attr('maxlength','300');
    }
    setDeliveryMessage();

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
                setShipping(price);
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
        //console.log(dir+url);
        return dir+url;
    }
    function setShipping(price){
        let url = "/modules/sendyapimodule/custom/setShipping.php";
        $.ajax({
            type: "POST",
            url: getLink(url),
            data: {
                action: 'getPackageShippingCost',
                shipping_cost: price
            },

            dataType: 'json',
            cache: false,
            success: function(msg)
            {
                console.log(msg);
                location.reload(true);
                $('#api_to').attr("placeholder", "Change destination");
            }
        });

    }

});
