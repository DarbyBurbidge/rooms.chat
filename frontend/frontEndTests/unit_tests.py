
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC
import time
from bs4 import BeautifulSoup

from runLogin import get_login_from_env, login

def view_room_test(username = None, password = None, id = None, expected_result = None):
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))

    if( username is  None and password is  None): 
        username, password = get_login_from_env()
    login(username, password, driver )
    driver.maximize_window()
    test_url = """http://localhost:5173/tester/""" + id
    driver.get(test_url)
    time.sleep(3)
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')
    return expected_result  in [h.get_text() for h in soup.find_all("h1")]
def view_room_invite_test(username = None, password = None, link = None, expected_result = None):
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))

    if( username is  None and password is  None): 
        username, password = get_login_from_env()
    login(username, password, driver )
    driver.maximize_window()
    test_url = """http://localhost:5173/invite/""" + link
    driver.get(test_url)
    time.sleep(5)
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')
    return expected_result  in soup.find("div", attrs={"class" : "modal-title"}).get_text()
    
def deauthed_url_test(test_url):
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    driver.get(test_url)
    time.sleep(3)
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')
    
    return "log in"  in [h.get_text().lower() for h in soup.find_all("button")]



if __name__ == "__main__":
    print(view_room_test(id = "665a719f6a668ea08588689a", expected_result="Max's Actual Room"))
    print(deauthed_url_test("""http://localhost:5173/tester/1"""))
    print(deauthed_url_test("""http://localhost:5173/home"""))
    print(view_room_invite_test(link = "ad3e7bb1-bc09-42c6-9215-2195b703bb63", expected_result="Max's Actual Room"))