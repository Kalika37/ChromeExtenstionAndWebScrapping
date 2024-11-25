function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
class HTTP {
  static POST(url, datas) {
    return new Promise((response, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open("POST", url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      // xhr.setRequestHeader("Content-Type", "application/json");
      const data = new FormData()
      for (const key in datas) {
        data.append(key, datas[key])
      }
      xhr.onload = () => response(xhr.response);

      xhr.send(data);
    })
  }
  static GET(url) {
    return new Promise((response, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("Get", url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      xhr.onload = () => response(xhr.response);
      xhr.send();
    })
  }

}
document.addEventListener('DOMContentLoaded', function () {
  const newsTextArea = document.getElementById('news-text');
  const feedbacktextarea = document.getElementById('news-text-fedback');
  const submitButton = document.getElementById('submit-button');
  const predictionResult = document.getElementById('prediction-result');
  const feedbackBtn = document.getElementById('feedback-btn');
  const feedbackSection = document.getElementById('feedback-section');
  const toggleContainer = document.querySelector('.toggle-container');
  // const toggleSwitch = document.querySelector('.toggle-switch');
  const title = document.getElementById('title');
  const newsTextLabel = document.getElementById('news-text-label');
  const feedbackHeader = document.getElementById('feedback-header');
  const feedbackNewsText = document.getElementById('feedback-news-text');
  const feedbackForm = document.getElementById('feedback-form');
  const socialShareDiv = document.getElementById('social-share');
  const shareFacebookButton = document.getElementById('share-facebook');
  const shareMore = document.getElementById('share-more');
  const shareTwitterButton = document.getElementById('share-twitter');
  const shareWhatsAppButton = document.getElementById('share-whatsapp');
  let currentLanguage = 'en';
  // Fake news prediction function
  predictionResult.firstElementChild.style.display = "none"
  predictionResult.style.display = "none"
  function predictNews(content) {
    if (window.chrome) {
      predictionResult.style.display = "block"
      predictionResult.firstElementChild.style.display = "block"
      predictionResult.lastElementChild.style.display = 'none'
      window.chrome.runtime.sendMessage({ command: 'CheckNewsForthis', clipboard: true, news: content }, (results) => {
        submitButton.disabled = false
        newsTextArea.nextElementSibling.innerHTML = ''
        predictionResult.firstElementChild.style.display = "none"
        predictionResult.lastElementChild.style.display = 'block'
        if (results.status) {
          updateSocialShareButtons(content)
          predictionResult.lastElementChild.querySelector(".description").innerHTML = results.news.description
          predictionResult.lastElementChild.querySelector(".date").innerHTML = results.news.date
          predictionResult.lastElementChild.querySelector(".source").innerHTML = results.news.source.title
          predictionResult.lastElementChild.querySelector(".source").onclick = () => {
            window.open(results.news.source.url)
          }
          predictionResult.lastElementChild.querySelector(".date").classList.add("remove")
          predictionResult.lastElementChild.querySelector(".date").onclick = null
          predictionResult.lastElementChild.querySelector("h3").innerHTML = results.news.title
          socialShareDiv.style.display = 'block'

        } else {
          predictionResult.lastElementChild.querySelector(".description").innerHTML = "This is may be added by someone mistakely or intentionally"
          predictionResult.lastElementChild.querySelector(".date").innerHTML = 'Report'
          predictionResult.lastElementChild.querySelector(".source").innerHTML = ''
          predictionResult.lastElementChild.querySelector(".date").classList.add("report")
          predictionResult.lastElementChild.querySelector(".date").onclick = () => {
            settings.reportFakeNews()
          }
          predictionResult.lastElementChild.querySelector(".source").onclick = null
          predictionResult.lastElementChild.querySelector("h3").innerHTML = "This is a Fake News"
        }
      });
    }
  }
  // Update social share buttons
  function updateSocialShareButtons(message) {
    shareFacebookButton.onclick = function () {
      window.chrome.runtime.sendMessage({ command: "ShareResult", shareto: "facebook", searchfor: message })
    };
    shareTwitterButton.onclick = function () {
      window.chrome.runtime.sendMessage({ command: "ShareResult", shareto: "twitter", searchfor: message })

    };

    shareWhatsAppButton.onclick = function () {
      window.chrome.runtime.sendMessage({ command: "ShareResult", shareto: "whatsapp", searchfor: message })
    };
    shareMore.onclick = function () {
      window.chrome.runtime.sendMessage({ command: "ShareResult", shareto: "more", searchfor: message })
    };
  }
  // Update language
  function updateLanguage() {
    title.textContent = currentLanguage === 'en' ? 'Fake News Detection' : 'झुटो समाचार पत्ता लगाउने';
    newsTextLabel.textContent = currentLanguage === 'en' ? 'Enter the news text:' : 'समाचारको पाठ प्रविष्ट गर्नुहोस्:';
    feedbackHeader.textContent = currentLanguage === 'en' ? 'Insert News\' Text Here:' : 'यहाँ समाचारको पाठ राख्नुहोस्:';
    feedbackBtn.textContent =
      feedbackSection.style.display === 'none'
        ? currentLanguage === 'en'
          ? 'Switch to Feedback Mode'
          : 'प्रतिक्रिया मोडमा जानुहोस्'
        : currentLanguage === 'en'
          ? 'Close Feedback Mode'
          : 'प्रतिक्रिया मोड बन्द गर्नुहोस्';
    submitButton.textContent = currentLanguage === 'en' ? 'Predict' : 'पूर्वानुमान गर्नुहोस्';
    newsTextArea.placeholder =
      currentLanguage === 'en' ? 'Paste or type news content here...' : 'यहाँ समाचारको पाठ टाइप वा पेस्ट गर्नुहोस्...';

    const radioButtons = document.querySelectorAll('.radio-group input');

    if (radioButtons[0].nextElementSibling) {
      radioButtons[0].nextElementSibling.textContent = currentLanguage === 'en' ? 'Real News' : 'साँचो समाचार';
      radioButtons[1].nextElementSibling.textContent = currentLanguage === 'en' ? 'Fake News' : 'झुटो समाचार';
    }
    if (newsTextArea.nextElementSibling.textContent.trim()) {
      newsTextArea.nextElementSibling.innerHTML = currentLanguage === 'en'
        ? 'Please enter some news content!'
        : 'कृपया केही समाचार प्रविष्ट गर्नुहोस्!'
    }
    if (feedbacktextarea.nextElementSibling.textContent.trim()) {
      feedbacktextarea.nextElementSibling.innerHTML = currentLanguage === 'en'
        ? 'Please enter some content!'
        : 'कृपया केही सामग्री प्रविष्ट गर्नुहोस्!'
    }
  }
  socialShareDiv.style.display = 'none';
  // Predict news when submit button is clicked
  submitButton.addEventListener('click', function () {
    const newsContent = newsTextArea.value.trim();
    if (newsContent.length >= 5) {
      predictNews(newsContent);
      newsTextArea.value = ""
      submitButton.disabled = true

    } else {
      predictionResult.style.display = 'none';
      socialShareDiv.style.display = 'none';
      newsTextArea.nextElementSibling.innerHTML = currentLanguage === 'en'
        ? 'Please enter some news content!(atleast 5 character)'
        : 'कृपया केही समाचार प्रविष्ट गर्नुहोस्!'
    }
  });
  feedbackBtn.onclick = (e) => {
    e.preventDefault()
    const feedback = feedbacktextarea.value.trim();
    if (feedback.length >= 5) {
      feedbacktextarea.nextElementSibling.innerHTML = ""
      feedbacktextarea.value = ''
      // ...
      feedbacktextarea.disabled=true
      feedbackBtn.disabled=true 
      feedbacktextarea.innerHTML='Feedback Sent'
      if (window.chrome) {
        window.chrome.runtime.sendMessage({
          command: "Feedback",
          feedback
        }, (response) => {
        });
      }

    } else {
      // predictionResult.style.display = 'none';
      // socialShareDiv.style.display = 'none';
      feedbacktextarea.nextElementSibling.innerHTML = currentLanguage === 'en'
        ? 'Please enter some content!(atleast 5 character)'
        : 'कृपया केही सामग्री प्रविष्ट गर्नुहोस्!'
    }
  }


  // Language toggle
  toggleContainer.onclick = () => {
    toggleContainer.classList.toggle('active');
    currentLanguage = currentLanguage === 'en' ? 'ne' : 'en';
    updateLanguage();
  }

  // Feedback form submission
  feedbackForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const feedbackText = feedbackNewsText.value.trim();
    const feedbackStatus = feedbackForm.querySelector('input[name="news-status"]:checked').value;
    alert(
      currentLanguage === 'en'
        ? `Feedback submitted! News: ${feedbackText}, Status: ${feedbackStatus}`
        : `प्रतिक्रिया पेश भयो! समाचार: ${feedbackText}, स्थिति: ${feedbackStatus}`
    );
    feedbackForm.reset();
  });
  // Initialize language
  updateLanguage();
});
