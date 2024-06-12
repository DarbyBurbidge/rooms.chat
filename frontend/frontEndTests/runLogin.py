from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC
import time
from bs4 import BeautifulSoup

def get_login_from_env(env = "../../backend/.env"):
    password = None
    username = None
    with open(env, "r") as f:
        for line in f.readlines():
            if("TEST_PASSWORD" in line): password = line.split("=")[-1].strip()
            if("TEST_USERNAME" in line): username = line.split("=")[-1].strip()
    if( username is not None and password is not None): return username, password
# Set up the WebDriver
def login(username = None, password = None, driver = None):

    if( username is  None and password is  None): 
        username, password = get_login_from_env()
    # Open the URL
    driver.get("http://localhost:5173/login")
    first_button = driver.find_element(By.CSS_SELECTOR, "button.btn.btn-outline-success")
    first_button.click()
    time.sleep(4)
    #get us to SSO
    username_field = driver.find_element(By.NAME, "identifier")  
    username_field.send_keys(username + "@pdx.edu")  # Replace with your actual username
    username_field.send_keys(Keys.RETURN)
    time.sleep(5)
    #now we are in SSO
    username_field = driver.find_element(By.NAME, "j_username")  
    username_field.send_keys(username )
    password_field = driver.find_element(By.NAME, "j_password")  
    password_field.send_keys(password ) 
    password_field.send_keys(Keys.RETURN)
    time.sleep(3)
    driver.find_element(By.CSS_SELECTOR, "[jsname='LgbsSe']").click()
    time.sleep(5)
    driver.find_elements(By.CSS_SELECTOR, "[jsname='LgbsSe']")[-1].click()

def login_test(username = None, password = None, click_back = -1):
    if( username is  None and password is  None): 
        username, password = get_login_from_env()
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    login( username, password, driver)
    fail_count = 0
    max_fails = 10
    page_source = driver.page_source
    
    # Parse the page source with BeautifulSoup
    soup = BeautifulSoup(page_source, 'html.parser')

    # Look for an <a> tag with href="/newroom"
    newroom_link = soup.find_all('a', href="newroom")
    while(fail_count < max_fails and len(newroom_link) == 0):
        time.sleep(3)
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')
        newroom_link = soup.find_all('a', href="newroom")
        #print(len(newroom_link ) != 0)
        fail_count += 1
    return len(newroom_link ) != 0

def message_test(username = None, password = None, message = "Test"):

    if( username is  None and password is  None): 
        username, password = get_login_from_env()
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    login(username, password, driver )
    ol = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, 'ol'))
    )

    # Find the first list item within the ordered list
    

    # Find the link within the first list item and click it
    first_link = ol.find_element(By.TAG_NAME, 'a')
    first_link.click()

    # Optionally, you might want to wait for the next page to load or perform other actions
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, 'body'))  # Example condition
    )
    text_area = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, 'rce-input-textarea'))
    )
    time.sleep(3)
    # Fill in the text area with some text
    text_area.send_keys(message)

    time.sleep(3)
    # Wait for the button to be clickable
    send_button = driver.find_element(By.XPATH, "//button[contains(@class, 'btn-primary') and text()='Send']") 
    # Click the button
    send_button.click()
    time.sleep(20)
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')

    # Look for an <a> tag with href="/newroom"
    last_msg = soup.find_all('div', attrs={"class":"rce-mbox-text"})[-1]
    return last_msg.get_text() == message
def make_room_test(username = None, password = None, room_name = "Test"):
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))

    if( username is  None and password is  None): 
        username, password = get_login_from_env()
    login(username, password, driver )
    driver.maximize_window()
    first_link = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, ".//a[contains(@href, 'newroom')]"))
    )

    # Click the link
    first_link.click()


    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, 'body')) 
    )
    text_area = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, 'roomName'))
    )

    # Fill in the text area with some text
    text_area.send_keys(room_name)

    
    send_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'btn-primary') and text()='Make new Chat Room']"))
    )
    # Click the button
    send_button.click()
    time.sleep(10)
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')
    return room_name in [h.get_text() for h in soup.find_all("h1")]
   
def delete_room_test(username = None, password = None, room_name = "test"):
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    if( username is  None and password is  None): 
        username, password = get_login_from_env()
    login(username, password, driver )
    driver.maximize_window()
    try:
        xpath = f"//a[.//div[contains(text(), '{room_name}')]]"

        # Wait for the <a> element to be present
        link = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, xpath))
        )

        # Click the <a> element
        link.click()

        # Optionally, wait for some condition after clicking the link
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, 'body'))  # Adjust as necessary
        )
        xpath = f"//a[contains(@href, 'admin')]"
        link = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, xpath))
        )

        # Click the <a> element
        link.click()
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, 'body'))  # Adjust as necessary
        )
    except:
        return False



    # Fill in the text area with some text

    
    send_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'btn-danger') ]"))
    )
    # Click the button
    send_button.click()
    time.sleep(10)
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')
    return room_name not in [h.get_text() for h in soup.find_all("div", attrs={"class": "fw-bold"})]
    


    
     
if __name__ == "__main__":
    print(message_test(message = "") == False)