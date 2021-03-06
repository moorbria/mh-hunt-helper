function openPopupLink(website) {
    chrome.tabs.query({'url': ['*://www.mousehuntgame.com/*', '*://apps.facebook.com/mousehunt/*']}, function(tabs) {
        if ( tabs.length > 0 ) {
            chrome.tabs.update(tabs[0].id, {'active': true});
            chrome.tabs.sendMessage(tabs[0].id, {link: website}, function (response) {});
        }
        else {
            displayErrorPopup("Please navigate to MouseHunt page first.");
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var buttons = ['mhmh', 'tsitu', 'userhistory', 'ryonn'];
    buttons.forEach(function(id) {
        var button_element = document.getElementById(id);
        if (!button_element) {
            return;
        }
        button_element.addEventListener('click', function() {
            openPopupLink(id);
        });
    });
	
	// Send message to MH Tab to sound the horn.
	var hornButton = document.getElementById("horn");
	hornButton.addEventListener('click', function() {
		chrome.tabs.query({'url': ['*://www.mousehuntgame.com/*', '*://apps.facebook.com/mousehunt/*']}, function(tabs) {
			if ( tabs.length > 0 ) {
				chrome.tabs.sendMessage(tabs[0].id, {action: "horn"}, function (response) {});
			}
			else {
				displayErrorPopup("Please navigate to MouseHunt page first.");
			}
		});
	});

    var huntTimer = document.getElementById("huntTimer");
	chrome.tabs.query({'url': ['*://www.mousehuntgame.com/*', '*://apps.facebook.com/mousehunt/*']}, function(tabs) {
		if ( tabs.length > 0 ) {
			chrome.tabs.sendMessage(tabs[0].id, {action: "huntTimer"}, function (response) {
                console.log(response);
                if(response === "Ready!"){
                    huntTimer.innerHTML = '<img src="http://images.clipartpanda.com/horn-clipart-Hupe.png" width="40px">';
                }else{
                    huntTimer.innerHTML = response;
                }
            });
		}
		else {
			displayErrorPopup("Please navigate to MouseHunt page first.");
		}
	});
});

function displayErrorPopup(message) {
    var error_popup = document.getElementById('error_popup');
    error_popup.innerText = message;
    error_popup.style.display = 'block';
    setTimeout( function(){
        error_popup.style.display = 'none';
    }, 2000);
}

document.getElementById('options').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
        // New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
    } else {
        // Reasonable fallback.
        window.open(chrome.runtime.getURL('options.html'));
    }
});
