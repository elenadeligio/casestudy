document.addEventListener("DOMContentLoaded", function() {
    const buttonsContainer = document.querySelector('#item3');
    const deviceImage = document.getElementById('device-image');
    const deviceText = document.getElementById('device-text');

    let activeButton = null;

    function updateURLParameter(key) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('aud_device', key);
        const newURL = `${window.location.pathname}?${urlParams.toString()}`;
        history.pushState({}, '', newURL);
    }

    fetch('data.json')
        .then(response => response.json())
        .then(jsonData => {
            createButtons(jsonData);

            function createButtons(data) {
                for (const key in data.record) {
                    const button = document.createElement('button');
                    button.setAttribute('type', 'button');
                    button.setAttribute('data-key', key);
                    button.textContent = getButtonName(data.record[key].name);
                    buttonsContainer.appendChild(button);
                    button.addEventListener('click', function() {
                        updateDeviceDetails(key);
                        setActiveButton(button);
                        updateURLParameter(key);
                    });

                    if (!activeButton) {
                        activeButton = button;
                        setActiveButton(button);
                    }
                }
            }

            function getButtonName(nameObject) {
                return window.innerWidth > 768 ? nameObject.desktop : nameObject.mobile;
            }

            function updateButtonNames(data) {
                const buttons = buttonsContainer.querySelectorAll('button');
                buttons.forEach(button => {
                    const key = button.getAttribute('data-key');
                    button.textContent = getButtonName(data.record[key].name);
                });
            }

            function updateDeviceDetails(key) {
                const version = window.innerWidth > 768 ? 'desktop' : 'mobile';
                const { img, text } = jsonData.record[key];
                deviceText.textContent = text;
                if (version === 'desktop') {
                    deviceImage.src = img.desktop;
                } else {
                    deviceImage.src = img.mobile;
                }
            }

            function setActiveButton(button) {
                if (activeButton) {
                    activeButton.classList.remove('active');
                }
                button.classList.add('active');
                activeButton = button;
            }

            window.addEventListener('resize', () => {
                updateButtonNames(jsonData);
                updateDeviceDetails(activeButton.getAttribute('data-key'));
            });
            updateDeviceDetails(Object.keys(jsonData.record)[0]);
        })
        .catch(error => console.error('Error fetching JSON:', error));
});