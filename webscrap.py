# import the required library
from selenium import webdriver
 
# initialize an instance of the chrome driver (browser)
driver = webdriver.Chrome()

# visit your target site
driver.get("https://kathmandupost.com/")

# output the full-page HTML
with open("index.html","w+") as f:
    f.write(driver.page_source)
    f.close()

# release the resources allocated by Selenium and shut down the browser
driver.quit()