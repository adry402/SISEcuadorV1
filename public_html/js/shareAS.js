/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {
    if (location.search.substr(1)) {
        Variable = location.search.substr(1);

        nombreIndicador = Variable;
    }

    var pageTitle = document.title ; //HTML page title
    var pageUrl = 'www.siise.gob.ec/share/agnGrafica.html?' + nombreIndicador; //Location of the page



    //user clicks on a share button
    $('.button-wrap').click(function(event) {
        var shareName = $(this).attr('class').split(' ')[0]; //get the first class name of clicked element

        switch (shareName) //switch to different links based on different social name
        {
            case 'facebook':
                var openLink = 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '&amp;title=' + encodeURIComponent(pageTitle);
                break;
            case 'twitter':
                var openLink = 'http://twitter.com/home?status=' + encodeURIComponent(pageTitle + ' ' + pageUrl);
                break;
            case 'google':
                var openLink = 'https://plus.google.com/share?url=' + encodeURIComponent(pageUrl) + '&amp;title=' + encodeURIComponent(pageTitle);
                break;
            case 'email':
                var openLink = 'mailto:?subject=' + pageTitle + '&body=Se encontró esta información que es muy útil : ' + pageUrl;
                break;
        }

        //Parameters for the Popup window
        winWidth = 650;
        winHeight = 450;
        winLeft = ($(window).width() - winWidth) / 2,
                winTop = ($(window).height() - winHeight) / 2,
                winOptions = 'width=' + winWidth + ',height=' + winHeight + ',top=' + winTop + ',left=' + winLeft;

        //open Popup window and redirect user to share website.
        window.open(openLink, 'Compartir este enlace', winOptions);
        return false;
    });
});