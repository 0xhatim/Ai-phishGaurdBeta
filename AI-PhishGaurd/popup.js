document.addEventListener('DOMContentLoaded', function () {
    var currentUrl = "";

    try {
        var resultDiv = document.getElementById('domainPlaceholder');

        var resultDivhidden = document.getElementById('domainPlaceholderhidden');
        var analysisButton = document.getElementById('analysisButton');
        var statusText = document.getElementById('statusText');
        var prescan = document.getElementById('prescan');
        var switch_id = document.getElementById('switch_item');
        var title = document.getElementById('title');
        var checkBox = document.getElementById('switch');

        if (checkBox) {
            checkBox.addEventListener('change', function () {
                if (analysisButton) {
                    analysisButton.disabled = this.checked;
                    analysisButton.classList.toggle('disabledButton', this.checked);
                }
            });
        }

        if (analysisButton) {
            analysisButton.addEventListener('click', function () {
                updateUI(true);
                updateSectionContentFinal();

            });
        }
    } catch (error) {
        console.error("Error initializing event listeners:", error);
    }


    function updateSectionContentFinal() {
        try {
            var sectionContent = document.querySelector('section');
            var currentDomain = resultDivhidden ? resultDivhidden.textContent : '';


            // Prepare the data to be sent
            var postData = {
                domain: currentDomain,
                htmlContent: document.documentElement.innerHTML // This gets the entire HTML content of the page
            };

            // Send the POST request
            fetch('http://API/api/analyze/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            })
                .then(response => response.json()) // Parse the response as JSON
                .then(data => {
                    console.log(data.flag);

                    if (data.flag === 'false') {
                        // Success response
                        sectionContent.innerHTML = `
                        <div class="card-success">
                        <!-- <button class="dismiss-success" type="button">×</button>-->
                         <div class="header-success">
                             <div class="image-success">
                                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 7L9.00004 18L3.99994 13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                             </div> 
                             <div class="content-success">
                                 <span class="title-success">Website Verified & Secure</span> 
                                 <p class="message-success">Good news! The website <span class="bold-text" id="domainPlaceholder"></span> has been thoroughly scanned and deemed secure. Rest assured, your digital safety is confirmed.</p> 
                             </div> 
                             <div class="actions-success">
                                 <button class="history-success" type="button">View Security Report</button> 
                                 <button class="track-success" type="button">Explore Site Details</button> 
                             </div> 
                         </div> 
                     </div>
                 
                        `;
                    } else if (data.flag === 'true') {
                        const reportLink = data.report_link;

                        // Warning response
                        sectionContent.innerHTML = `
                        <div class="card-danger">
                        <div class="header-danger">
                          <div class="image-danger">
                              <svg aria-hidden="true" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linejoin="round" stroke-linecap="round"></path>
                                </svg>
                          </div> 
                          <div class="content-danger">
                            <span class="title-danger">⚠️ Caution: Security Risk Detected!</span> 
                            <p class="message-danger">
                              Alert! <span class="bold-text" id="domainPlaceholder"></span> has been flagged for potential security risks. Protect your data and devices. Proceed with caution.
                            </p> 
                          </div> 
                          <div class="actions-danger">
                          <a href="#" id="reportLink" class="desactivate-danger" type="button">Read Report from our AI</a>
                          <button class="cancel-danger" type="button">Block Website</button> 
                          </div> 
                        </div> 
                      </div>
                        `;
                        const reportLinkElement = document.getElementById('reportLink');

                        // Add an event listener to the link
                        reportLinkElement.addEventListener('click', function (e) {
                            e.preventDefault(); // Prevent the default behavior (opening in the same tab)

                            const reportLink = data.report_link;
                            window.open(reportLink, '_blank'); // Open the link in a new tab
                        });
                    } else {
                        // Handle other responses
                        console.error("Received unexpected status code:", data);
                    }
                })
                .catch(error => {
                    console.error("Error sending POST request:", error);
                });

        } catch (error) {
            console.error("Error updating section content:", error);
        }
    }
    function updateSectionContent() {
        try {
            var sectionContent = document.querySelector('section');
            var currentDomain = resultDiv ? resultDiv.textContent : '';
            console.log(currentDomain);

            if (sectionContent) {
                if (currentDomain === 'www.saudia.com') {
                    // Response for www.saudia.com
                    sectionContent.innerHTML = `
                    <div class="card-success">
                    <!-- <button class="dismiss-success" type="button">×</button>-->
                     <div class="header-success">
                         <div class="image-success">
                             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 7L9.00004 18L3.99994 13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                         </div> 
                         <div class="content-success">
                             <span class="title-success">Website Verified & Secure</span> 
                             <p class="message-success">Good news! The website <span class="bold-text" id="domainPlaceholder"></span> has been thoroughly scanned and deemed secure. Rest assured, your digital safety is confirmed.</p> 
                         </div> 
                         <div class="actions-success">
                             <button class="history-success" type="button">View Security Report</button> 
                             <button class="track-success" type="button">Explore Site Details</button> 
                         </div> 
                     </div> 
                 </div>
             
                    `;
                } else {
                    // General response for other URLs
                    sectionContent.innerHTML = `
                    <div class="card-danger">
                    <div class="header-danger">
                      <div class="image-danger">
                          <svg aria-hidden="true" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" fill="none">
                              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linejoin="round" stroke-linecap="round"></path>
                            </svg>
                      </div> 
                      <div class="content-danger">
                        <span class="title-danger">⚠️ Caution: Security Risk Detected!</span> 
                        <p class="message-danger">
                          Alert! <span class="bold-text" id="domainPlaceholder"></span> has been flagged for potential security risks. Protect your data and devices. Proceed with caution.
                        </p> 
                      </div> 
                      <div class="actions-danger">
                        <button class="desactivate-danger" type="button">Block Page</button> 
                        <button class="cancel-danger" type="button">Report This Page</button> 
                      </div> 
                    </div> 
                  </div>
                    `;
                }
            }
        } catch (error) {
            console.error("Error updating section content:", error);
        }
    }

    function extractDomain(url) {
        try {
            return new URL(url).hostname;
        } catch (error) {
            console.error("Error extracting domain:", error);
            return "Unable to extract domain";
        }
    }

    function updateUI(isScanning) {
        try {
            if (isScanning) {
                if (resultDiv) resultDiv.classList.add('animate-fadeIn');
                if (analysisButton) {
                    analysisButton.disabled = true;
                    analysisButton.classList.add('disabledButton');
                }
                if (prescan) prescan.innerHTML = ``;
                if (switch_id) switch_id.innerHTML = ``;
                if (title) title.innerText = `PhishGuard: Scanning in Progress 👀`;
                if (statusText && resultDiv) {
                    statusText.innerHTML = `We're currently scanning <span class="bold-text">${resultDiv.textContent}</span> for potential threats. Your digital safety is our priority. Please wait while we conduct a thorough analysis.<br><br><br><div class="animated-corena-eye-lid"><div class="animated-corena-eye"><div class="animated-corena-cornea"><div class="animated-corena-white-pupil"></div></div> </div></div>`;
                }
            } else {
                if (statusText && resultDiv) {
                    statusText.innerHTML = `Let A-PhishGuard be your digital sentinel. Click 'Run Analysis' to scan and secure <span class="bold-text">${resultDiv.textContent}</span>.`;
                }
            }
        } catch (error) {
            console.error("Error updating UI:", error);
        }
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        try {
            var currentUrl = tabs[0].url;
            if (resultDivhidden) resultDivhidden.innerText = currentUrl;

            var domain = extractDomain(currentUrl);
            if (resultDiv) resultDiv.innerText = domain;
            updateUI(false);
        } catch (error) {
            console.error("Error querying tabs:", error);
        }
    });
});
